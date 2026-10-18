import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {isAllowedOrigin} from '@/lib/origin';
import {db} from '@/lib/db';
import type {RowDataPacket} from 'mysql2';
type Sheet=RowDataPacket&{revision:number;content:string};
const err=(message:string,status:number)=>NextResponse.json({error:message},{status});
const valid=(n:unknown,min=1)=>Number.isSafeInteger(n)&&Number(n)>=min;
const editor=(role:string)=>['owner','admin','editor'].includes(role);
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return err('No autorizado',401);
 const {id}=await params;if(!/^[1-9][0-9]*$/.test(id)||!valid(Number(id)))return err('Proyecto inválido',400);
 const [projects]=await db().execute<RowDataPacket[]>('SELECT id FROM hub_projects WHERE id=?',[id]);
 if(!projects.length)return err('Proyecto inexistente',404);
 const rev=new URL(req.url).searchParams.get('revision');
 if(rev!==null){
  if(!/^[1-9][0-9]*$/.test(rev)||!valid(Number(rev)))return err('Revisión inválida',400);
  const [versions]=await db().execute<Sheet[]>('SELECT revision,content,updated_by,created_at FROM hub_project_technical_sheet_versions WHERE project_id=? AND revision=?',[id,Number(rev)]);
  return versions.length?NextResponse.json({version:versions[0]}):err('Versión inexistente',404);
 }
 const [rows]=await db().execute<Sheet[]>('SELECT revision,content,updated_by,updated_at FROM hub_project_technical_sheets WHERE project_id=?',[id]);
 const [history]=await db().execute<RowDataPacket[]>('SELECT revision,updated_by,created_at FROM hub_project_technical_sheet_versions WHERE project_id=? ORDER BY revision DESC LIMIT 100',[id]);
 return NextResponse.json({sheet:rows[0]??null,versions:history,canEdit:editor(user.role)});
}
export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return err('No autorizado',401);
 if(!editor(user.role))return err('Sin permisos',403);
 if(!isAllowedOrigin(req))return err('Origen no autorizado',403);
 const {id}=await params;if(!/^[1-9][0-9]*$/.test(id)||!valid(Number(id)))return err('Proyecto inválido',400);
 let body;try{body=await req.json()}catch{return err('JSON inválido',400)}
 if(!valid(body?.expectedRevision,0)||typeof body.content!=='string'||body.content.length>1000000)return err('Datos inválidos',400);
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [projects]=await conn.execute<RowDataPacket[]>('SELECT id FROM hub_projects WHERE id=? FOR UPDATE',[id]);
  if(!projects.length){await conn.rollback();return err('Proyecto inexistente',404)}
  const [rows]=await conn.execute<Sheet[]>('SELECT revision FROM hub_project_technical_sheets WHERE project_id=? FOR UPDATE',[id]);
  const revision=rows[0]?.revision??0;
  if(revision!==body.expectedRevision){await conn.rollback();return err('Conflicto de revisión',409)}
  if(revision===0)await conn.execute('INSERT INTO hub_project_technical_sheets(project_id,content,revision,updated_by) VALUES(?,?,1,?)',[id,body.content,user.id]);
  else await conn.execute('UPDATE hub_project_technical_sheets SET content=?,revision=revision+1,updated_by=? WHERE project_id=?',[body.content,user.id,id]);
  await conn.execute('INSERT INTO hub_project_technical_sheet_versions(project_id,revision,content,updated_by) VALUES(?,?,?,?)',[id,revision+1,body.content,user.id]);
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'update','technical_sheet',?,JSON_OBJECT('revision',?))",[user.id,id,revision+1]);
  await conn.commit();return NextResponse.json({ok:true,revision:revision+1});
 }catch(e){try{await conn.rollback()}catch{}throw e}finally{conn.release()}
}
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return err('No autorizado',401);
 if(!editor(user.role))return err('Sin permisos',403);
 if(!isAllowedOrigin(req))return err('Origen no autorizado',403);
 const {id}=await params;if(!/^[1-9][0-9]*$/.test(id)||!valid(Number(id)))return err('Proyecto inválido',400);
 let body;try{body=await req.json()}catch{return err('JSON inválido',400)}
 if(!valid(body?.revision)||!valid(body?.expectedRevision))return err('Revisión inválida',400);
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [rows]=await conn.execute<Sheet[]>('SELECT revision FROM hub_project_technical_sheets WHERE project_id=? FOR UPDATE',[id]);
  if(!rows.length){await conn.rollback();return err('Ficha inexistente',404)}
  if(rows[0].revision!==body.expectedRevision){await conn.rollback();return err('Conflicto de revisión',409)}
  const [previous]=await conn.execute<Sheet[]>('SELECT content FROM hub_project_technical_sheet_versions WHERE project_id=? AND revision=?',[id,body.revision]);
  if(!previous.length){await conn.rollback();return err('Versión inexistente',404)}
  await conn.execute('UPDATE hub_project_technical_sheets SET content=?,revision=revision+1,updated_by=? WHERE project_id=?',[previous[0].content,user.id,id]);
  await conn.execute('INSERT INTO hub_project_technical_sheet_versions(project_id,revision,content,updated_by) VALUES(?,?,?,?)',[id,body.expectedRevision+1,previous[0].content,user.id]);
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'restore','technical_sheet',?,JSON_OBJECT('fromRevision',?,'revision',?))",[user.id,id,body.revision,body.expectedRevision+1]);
  await conn.commit();return NextResponse.json({ok:true,revision:body.expectedRevision+1});
 }catch(e){try{await conn.rollback()}catch{}throw e}finally{conn.release()}
}
