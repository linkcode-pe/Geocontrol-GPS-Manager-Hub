import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {isAllowedOrigin} from '@/lib/origin';
import {db} from '@/lib/db';
import type {RowDataPacket,ResultSetHeader} from 'mysql2';

export async function GET(req:Request){
 const user=await currentUser();if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 const url=new URL(req.url),projectId=Number(url.searchParams.get('projectId'));
 if(!Number.isSafeInteger(projectId)||projectId<1)return NextResponse.json({error:'Proyecto inválido'},{status:400});
 const includeArchived=url.searchParams.get('archived')==='1';
 const [rows]=await db().execute<RowDataPacket[]>('SELECT id,project_id,title,body,revision,archived_at,created_at,updated_at FROM hub_documents WHERE project_id=? '+(includeArchived?'':'AND archived_at IS NULL ')+'ORDER BY id DESC LIMIT 100',[projectId]);
 return NextResponse.json({documents:rows});
}
export async function POST(req:Request){
 const user=await currentUser();if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 if(!['owner','admin','editor'].includes(user.role))return NextResponse.json({error:'Sin permisos'},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:'Origen no autorizado'},{status:403});
 let body;try{body=await req.json()}catch{return NextResponse.json({error:'JSON inválido'},{status:400})}
 const projectId=body?.projectId,title=typeof body?.title==='string'?body.title.trim():'',content=body?.content;
 if(!Number.isSafeInteger(projectId)||projectId<1||!title||title.length>255||typeof content!=='string'||content.length>1000000)return NextResponse.json({error:'Documento inválido'},{status:400});
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [projects]=await conn.execute<RowDataPacket[]>('SELECT id FROM hub_projects WHERE id=?',[projectId]);
  if(!projects.length){await conn.rollback();return NextResponse.json({error:'Proyecto inexistente'},{status:404})}
  const [result]=await conn.execute<ResultSetHeader>('INSERT INTO hub_documents(project_id,title,body,revision) VALUES(?,?,?,1)',[projectId,title,content]);
  await conn.execute('INSERT INTO hub_document_versions(document_id,revision,title,body,updated_by) VALUES(?,1,?,?,?)',[result.insertId,title,content,user.id]);
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'create','document',?,JSON_OBJECT('projectId',?,'revision',1))",[user.id,result.insertId,projectId]);
  await conn.commit();return NextResponse.json({ok:true,id:result.insertId,revision:1},{status:201});
 }catch(e){try{await conn.rollback()}catch{}throw e}finally{conn.release()}
}
