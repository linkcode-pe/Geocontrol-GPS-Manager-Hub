import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {isAllowedOrigin} from '@/lib/origin';
import {db} from '@/lib/db';
import type {RowDataPacket,ResultSetHeader} from 'mysql2';

type Document=RowDataPacket&{id:number;project_id:number;revision:number;title:string;body:string;archived_at:Date|null};
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 const {id}=await params;if(!/^[1-9][0-9]*$/.test(id)||!Number.isSafeInteger(Number(id)))return NextResponse.json({error:'ID inválido'},{status:400});
 const rev=new URL(req.url).searchParams.get('revision');
 if(rev!==null&&(!/^[1-9][0-9]*$/.test(rev)||!Number.isSafeInteger(Number(rev))))return NextResponse.json({error:'Revisión inválida'},{status:400});
 const [documents]=await db().execute<RowDataPacket[]>('SELECT id FROM hub_documents WHERE id=?',[id]);
 if(!documents.length)return NextResponse.json({error:'Documento inexistente'},{status:404});
 const [rows]=await db().execute<RowDataPacket[]>('SELECT revision,title,'+(rev===null?'NULL AS body':'body')+',archived_at,updated_by,created_at FROM hub_document_versions WHERE document_id=? '+(rev===null?'ORDER BY revision DESC LIMIT 100':'AND revision=?'),rev===null?[id]:[id,Number(rev)]);
 if(rev!==null&&!rows.length)return NextResponse.json({error:'Versión no encontrada'},{status:404});
 return NextResponse.json(rev===null?{versions:rows}:{version:rows[0]});
}
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 if(!['owner','admin','editor'].includes(user.role))return NextResponse.json({error:'Sin permisos'},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:'Origen no autorizado'},{status:403});
 const {id}=await params;if(!/^[1-9][0-9]*$/.test(id)||!Number.isSafeInteger(Number(id)))return NextResponse.json({error:'ID inválido'},{status:400});
 let body;try{body=await req.json()}catch{return NextResponse.json({error:'JSON inválido'},{status:400})}
 if(!Number.isSafeInteger(body?.revision)||body.revision<1||!Number.isSafeInteger(body?.expectedRevision)||body.expectedRevision<1)return NextResponse.json({error:'Revisión inválida'},{status:400});
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [rows]=await conn.execute<Document[]>('SELECT id,project_id,revision,title,body,archived_at FROM hub_documents WHERE id=? FOR UPDATE',[id]);
  if(!rows.length){await conn.rollback();return NextResponse.json({error:'Documento inexistente'},{status:404})}
  const current=rows[0];
  if(current.revision!==body.expectedRevision){await conn.rollback();return NextResponse.json({error:'El documento cambió en otra sesión'},{status:409})}
  const [previous]=await conn.execute<Document[]>('SELECT title,body FROM hub_document_versions WHERE document_id=? AND revision=?',[id,body.revision]);
  if(!previous.length){await conn.rollback();return NextResponse.json({error:'Versión no encontrada'},{status:404})}
  const [result]=await conn.execute<ResultSetHeader>('UPDATE hub_documents SET title=?,body=?,revision=revision+1 WHERE id=? AND revision=?',[previous[0].title,previous[0].body,id,body.expectedRevision]);
  if(result.affectedRows!==1){await conn.rollback();return NextResponse.json({error:'Conflicto de revisión'},{status:409})}
  await conn.execute('INSERT INTO hub_document_versions(document_id,revision,title,body,archived_at,updated_by) SELECT id,revision,title,body,archived_at,? FROM hub_documents WHERE id=?',[user.id,id]);
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'restore','document',?,JSON_OBJECT('fromRevision',?,'revision',?,'projectId',?))",[user.id,id,body.revision,body.expectedRevision+1,current.project_id]);
  await conn.commit();return NextResponse.json({ok:true,revision:body.expectedRevision+1});
 }catch(e){try{await conn.rollback()}catch{}throw e}finally{conn.release()}
}
