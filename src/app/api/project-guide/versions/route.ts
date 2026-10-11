import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {isAllowedOrigin} from '@/lib/origin';
import {db} from '@/lib/db';
import type {RowDataPacket,ResultSetHeader} from 'mysql2';

type Version=RowDataPacket & {revision:number;updated_by:number|null;created_at:Date;content:string};
export async function GET(req:Request){
 const user=await currentUser();if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 const url=new URL(req.url);
 const revisionParam=url.searchParams.get('revision');
 if(revisionParam!==null){
  if(!/^[1-9][0-9]*$/.test(revisionParam)||!Number.isSafeInteger(Number(revisionParam)))return NextResponse.json({error:'Versión inválida'},{status:400});
  const [rows]=await db().execute<Version[]>('SELECT revision,content,updated_by,created_at FROM hub_project_guide_versions WHERE guide_id=1 AND revision=?',[Number(revisionParam)]);
  if(!rows.length)return NextResponse.json({error:'Versión no encontrada'},{status:404});
  return NextResponse.json({version:rows[0]});
 }
 const [rows]=await db().execute<Version[]>('SELECT revision,updated_by,created_at FROM hub_project_guide_versions WHERE guide_id=1 ORDER BY revision DESC LIMIT 100');
 return NextResponse.json({versions:rows});
}
export async function POST(req:Request){
 const user=await currentUser();if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 if(!['owner','admin'].includes(user.role))return NextResponse.json({error:'Sin permisos'},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:'Origen no autorizado'},{status:403});
 let body;try{body=await req.json();}catch{return NextResponse.json({error:'Datos inválidos'},{status:400});}
 if(!Number.isSafeInteger(body?.revision)||body.revision<1||!Number.isSafeInteger(body?.expectedRevision)||body.expectedRevision<1)return NextResponse.json({error:'Versión inválida'},{status:400});
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [current]=await conn.execute<Version[]>('SELECT content,revision,updated_by FROM hub_project_guide WHERE id=1 FOR UPDATE');
  if(!current.length){await conn.rollback();return NextResponse.json({error:'Guía no inicializada'},{status:404});}
  if(current[0].revision!==body.expectedRevision){await conn.rollback();return NextResponse.json({error:'La guía cambió en otra sesión. Recarga antes de recuperar.'},{status:409});}
  const [previous]=await conn.execute<Version[]>('SELECT content FROM hub_project_guide_versions WHERE guide_id=1 AND revision=?',[body.revision]);
  if(!previous.length){await conn.rollback();return NextResponse.json({error:'Versión no encontrada'},{status:404});}
  await conn.execute('INSERT INTO hub_project_guide_versions(guide_id,revision,content,updated_by) VALUES(1,?,?,?) ON DUPLICATE KEY UPDATE id=id',[current[0].revision,current[0].content,current[0].updated_by]);
  const [result]=await conn.execute<ResultSetHeader>('UPDATE hub_project_guide SET content=?,revision=revision+1,updated_by=? WHERE id=1 AND revision=?',[previous[0].content,user.id,body.expectedRevision]);
  if(result.affectedRows!==1){await conn.rollback();return NextResponse.json({error:'Conflicto de versión'},{status:409});}
  await conn.execute('INSERT INTO hub_project_guide_versions(guide_id,revision,content,updated_by) VALUES(1,?,?,?)',[body.expectedRevision+1,previous[0].content,user.id]);
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'restore','project_guide',1,JSON_OBJECT('fromRevision',?,'revision',?))",[user.id,body.revision,body.expectedRevision+1]);
  await conn.commit();
  return NextResponse.json({ok:true,revision:body.expectedRevision+1});
 }catch(error){try{await conn.rollback();}catch{}throw error;}finally{conn.release();}
}
