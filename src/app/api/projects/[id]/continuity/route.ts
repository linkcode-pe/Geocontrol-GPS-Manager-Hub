import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {isAllowedOrigin} from '@/lib/origin';
import {db} from '@/lib/db';
import type {RowDataPacket,ResultSetHeader} from 'mysql2';
const err=(message:string,status:number)=>NextResponse.json({error:message},{status});
const validId=(n:unknown)=>Number.isSafeInteger(n)&&Number(n)>0;
const canWrite=(role:string)=>['owner','admin','editor'].includes(role);
const kinds=['decision','milestone','next_action'];
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return err('No autorizado',401);
 const {id}=await params;if(!/^[1-9]\d*$/.test(id)||!validId(Number(id)))return err('Proyecto inválido',400);
 const [projects]=await db().execute<RowDataPacket[]>('SELECT id FROM hub_projects WHERE id=?',[id]);if(!projects.length)return err('Proyecto inexistente',404);
 const [entries]=await db().execute<RowDataPacket[]>("SELECT id,kind,title,details,status,due_date,revision,created_at,updated_at FROM hub_project_continuity WHERE project_id=? ORDER BY CASE WHEN status='open' THEN 0 ELSE 1 END, id DESC LIMIT 300",[id]);
 return NextResponse.json({entries,canEdit:canWrite(user.role)});
}
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return err('No autorizado',401);
 if(!canWrite(user.role))return err('Sin permisos',403);
 if(!isAllowedOrigin(req))return err('Origen no autorizado',403);
 const {id}=await params;if(!/^[1-9]\d*$/.test(id)||!validId(Number(id)))return err('Proyecto inválido',400);
 let body;try{body=await req.json()}catch{return err('JSON inválido',400)}
 const title=typeof body?.title==='string'?body.title.trim():'';
 const details=typeof body?.details==='string'?body.details.trim():'';
 const dueDate=body?.dueDate==null||body?.dueDate===''?null:body?.dueDate;
 if(!kinds.includes(body?.kind)||!title||title.length>255||typeof body?.details!=='string'||details.length>10000||(dueDate!==null&&(typeof dueDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)||Number.isNaN(Date.parse(dueDate)))))return err('Datos inválidos',400);
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [projects]=await conn.execute<RowDataPacket[]>('SELECT id FROM hub_projects WHERE id=? FOR UPDATE',[id]);if(!projects.length){await conn.rollback();return err('Proyecto inexistente',404)}
  const [result]=await conn.execute<ResultSetHeader>('INSERT INTO hub_project_continuity(project_id,kind,title,details,due_date,created_by,updated_by) VALUES(?,?,?,?,?,?,?)',[id,body.kind,title,details,dueDate,user.id,user.id]);
  await conn.execute("INSERT INTO hub_project_continuity_versions(entry_id,revision,title,details,status,due_date,updated_by) VALUES(?,1,?,?,'open',?,?)",[result.insertId,title,details,dueDate,user.id]);
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'create','project_continuity',?,JSON_OBJECT('projectId',?,'kind',?,'revision',1))",[user.id,result.insertId,Number(id),body.kind]);
  await conn.commit();return NextResponse.json({ok:true,id:result.insertId,revision:1},{status:201});
 }catch(e){try{await conn.rollback()}catch{}throw e}finally{conn.release()}
}
