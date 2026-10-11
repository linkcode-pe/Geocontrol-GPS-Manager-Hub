import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {isAllowedOrigin} from '@/lib/origin';
import {db} from '@/lib/db';
import type {RowDataPacket,ResultSetHeader} from 'mysql2';

type Document=RowDataPacket&{id:number;project_id:number;title:string;body:string;revision:number;archived_at:Date|null};
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 if(!['owner','admin','editor'].includes(user.role))return NextResponse.json({error:'Sin permisos'},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:'Origen no autorizado'},{status:403});
 const {id}=await params;if(!/^[1-9][0-9]*$/.test(id)||!Number.isSafeInteger(Number(id)))return NextResponse.json({error:'ID inválido'},{status:400});
 let body;try{body=await req.json()}catch{return NextResponse.json({error:'JSON inválido'},{status:400})}
 if(!Number.isSafeInteger(body?.revision)||body.revision<1)return NextResponse.json({error:'Revisión inválida'},{status:400});
 const action=body?.action;
 if(!['update','archive','unarchive'].includes(action))return NextResponse.json({error:'Acción inválida'},{status:400});
 if(action==='update'&&((typeof body.title!=='string'||!body.title.trim()||body.title.trim().length>255)||(typeof body.content!=='string'||body.content.length>1000000)))return NextResponse.json({error:'Documento inválido'},{status:400});
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [rows]=await conn.execute<Document[]>('SELECT id,project_id,title,body,revision,archived_at FROM hub_documents WHERE id=? FOR UPDATE',[id]);
  if(!rows.length){await conn.rollback();return NextResponse.json({error:'Documento inexistente'},{status:404})}
  const current=rows[0];
  if(current.revision!==body.revision){await conn.rollback();return NextResponse.json({error:'El documento cambió en otra sesión'},{status:409})}
  if((action==='archive'&&current.archived_at)||(action==='unarchive'&&!current.archived_at)||(action==='update'&&current.archived_at)){await conn.rollback();return NextResponse.json({error:'Estado de documento incompatible'},{status:409})}
  const title=action==='update'?body.title.trim():current.title,content=action==='update'?body.content:current.body;
  const archived=action==='archive'?true:action==='unarchive'?false:!!current.archived_at;
  const [result]=await conn.execute<ResultSetHeader>('UPDATE hub_documents SET title=?,body=?,revision=revision+1,archived_at='+ (archived?'CURRENT_TIMESTAMP':'NULL')+',archived_by=? WHERE id=? AND revision=?',[title,content,archived?user.id:null,id,body.revision]);
  if(result.affectedRows!==1){await conn.rollback();return NextResponse.json({error:'Conflicto de revisión'},{status:409})}
  await conn.execute('INSERT INTO hub_document_versions(document_id,revision,title,body,archived_at,updated_by) SELECT id,revision,title,body,archived_at,? FROM hub_documents WHERE id=?',[user.id,id]);
  await conn.execute('INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,?,?,?,JSON_OBJECT(\'revision\',?,\'projectId\',?))',[user.id,action,'document',id,body.revision+1,current.project_id]);
  await conn.commit();return NextResponse.json({ok:true,revision:body.revision+1});
 }catch(e){try{await conn.rollback()}catch{}throw e}finally{conn.release()}
}
