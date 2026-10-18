import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {isAllowedOrigin} from '@/lib/origin';
import {db} from '@/lib/db';
import type {RowDataPacket,ResultSetHeader} from 'mysql2';
type Entry=RowDataPacket&{id:number;project_id:number;kind:string;title:string;details:string;status:string;revision:number;due_date:Date|null};
const err=(message:string,status:number)=>NextResponse.json({error:message},{status});
export async function GET(req:Request,{params}:{params:Promise<{entryId:string}>}){
 const user=await currentUser();if(!user)return err('No autorizado',401);
 const {entryId}=await params;if(!/^[1-9]\d*$/.test(entryId)||!Number.isSafeInteger(Number(entryId)))return err('ID inválido',400);
 const [rows]=await db().execute<Entry[]>('SELECT id,project_id,kind,title,details,status,due_date,revision FROM hub_project_continuity WHERE id=?',[entryId]);
 if(!rows.length)return err('Registro inexistente',404);
 const [versions]=await db().execute<RowDataPacket[]>('SELECT revision,title,details,status,due_date,updated_by,created_at FROM hub_project_continuity_versions WHERE entry_id=? ORDER BY revision DESC LIMIT 100',[entryId]);
 return NextResponse.json({entry:rows[0],versions,canEdit:['owner','admin','editor'].includes(user.role)});
}
export async function PATCH(req:Request,{params}:{params:Promise<{entryId:string}>}){
 const user=await currentUser();if(!user)return err('No autorizado',401);
 if(!['owner','admin','editor'].includes(user.role))return err('Sin permisos',403);
 if(!isAllowedOrigin(req))return err('Origen no autorizado',403);
 const {entryId}=await params;if(!/^[1-9]\d*$/.test(entryId)||!Number.isSafeInteger(Number(entryId)))return err('ID inválido',400);
 let body;try{body=await req.json()}catch{return err('JSON inválido',400)}
 if(!Number.isSafeInteger(body?.revision)||body.revision<1||!['open','done'].includes(body?.status))return err('Datos inválidos',400);
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [rows]=await conn.execute<Entry[]>('SELECT id,project_id,title,details,status,due_date,revision FROM hub_project_continuity WHERE id=? FOR UPDATE',[entryId]);
  if(!rows.length){await conn.rollback();return err('Registro inexistente',404)}
  const row=rows[0];if(row.revision!==body.revision){await conn.rollback();return err('Conflicto de revisión',409)}
  if(row.status===body.status){await conn.rollback();return err('Sin cambios',409)}
  const [result]=await conn.execute<ResultSetHeader>('UPDATE hub_project_continuity SET status=?,revision=revision+1,updated_by=? WHERE id=? AND revision=?',[body.status,user.id,entryId,body.revision]);
  if(result.affectedRows!==1){await conn.rollback();return err('Conflicto de revisión',409)}
  await conn.execute('INSERT INTO hub_project_continuity_versions(entry_id,revision,title,details,status,due_date,updated_by) VALUES(?,?,?,?,?,?,?)',[row.id,row.revision+1,row.title,row.details,body.status,row.due_date,user.id]);
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'update','project_continuity',?,JSON_OBJECT('projectId',?,'revision',?,'status',?))",[user.id,row.id,row.project_id,row.revision+1,body.status]);
  await conn.commit();return NextResponse.json({ok:true,revision:row.revision+1});
 }catch(e){try{await conn.rollback()}catch{}throw e}finally{conn.release()}
}
