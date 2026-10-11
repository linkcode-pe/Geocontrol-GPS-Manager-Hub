import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { isAllowedOrigin } from '@/lib/origin';
import { db } from '@/lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

type GuideRow=RowDataPacket & {content:string;revision:number;updated_at:Date};
export async function GET(){
 const user=await currentUser();if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 const [rows]=await db().execute<GuideRow[]>('SELECT content,revision,updated_at FROM hub_project_guide WHERE id=1');
 if(!rows.length)return NextResponse.json({error:'Guía no inicializada'},{status:404});
 return NextResponse.json({content:rows[0].content,revision:rows[0].revision,updatedAt:rows[0].updated_at,canEdit:['owner','admin'].includes(user.role)});
}
export async function PUT(req:Request){
 const user=await currentUser();if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 if(!['owner','admin'].includes(user.role))return NextResponse.json({error:'Sin permisos'},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:'Origen no autorizado'},{status:403});
 let body;try{body=await req.json();}catch{return NextResponse.json({error:'Datos inválidos'},{status:400});}
 if(typeof body?.content!=='string'||body.content.trim().length<20||body.content.length>100000||!Number.isSafeInteger(body.revision)||body.revision<1)return NextResponse.json({error:'Contenido o versión inválida'},{status:400});
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [result]=await conn.execute<ResultSetHeader>('UPDATE hub_project_guide SET content=?,revision=revision+1,updated_by=? WHERE id=1 AND revision=?',[body.content,user.id,body.revision]);
  if(result.affectedRows!==1){await conn.rollback();return NextResponse.json({error:'El documento fue modificado en otra sesión. Recarga antes de guardar.'},{status:409});}
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'update','project_guide',1,JSON_OBJECT('revision',?))",[user.id,body.revision+1]);
  await conn.commit();
 }catch(error){try{await conn.rollback();}catch{}throw error;}finally{conn.release();}
 return NextResponse.json({ok:true,revision:body.revision+1});
}
