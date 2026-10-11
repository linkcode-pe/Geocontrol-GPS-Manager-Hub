import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { isAllowedOrigin } from "@/lib/origin";
import { db } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export async function GET(){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 const [projects]=await db().execute<RowDataPacket[]>(`SELECT p.id,p.slug,p.title,p.summary,p.status,COUNT(DISTINCT ph.id) AS phaseCount,COUNT(DISTINCT t.id) AS taskCount,COUNT(DISTINCT CASE WHEN t.status='done' THEN t.id END) AS doneCount FROM hub_projects p LEFT JOIN hub_phases ph ON ph.project_id=p.id LEFT JOIN hub_tasks t ON t.project_id=p.id GROUP BY p.id ORDER BY p.id DESC`);
 return NextResponse.json({projects});
}
export async function POST(req:Request){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 if(!["owner","admin","editor"].includes(user.role))return NextResponse.json({error:"Sin permisos"},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:"Origen no autorizado"},{status:403});
 let body;try{body=await req.json();}catch{return NextResponse.json({error:"JSON inválido"},{status:400});}
 const title=typeof body?.title==="string"?body.title.trim():"";
 const summary=typeof body?.summary==="string"?body.summary.trim():"";
 if(!title||title.length>255||summary.length>5000)return NextResponse.json({error:"Datos inválidos"},{status:400});
 const slug=`project-${crypto.randomUUID()}`;
 const conn=await db().getConnection();
 let insertId:number;
 try{
  await conn.beginTransaction();
  const [result]=await conn.execute<ResultSetHeader>("INSERT INTO hub_projects(slug,title,summary,status) VALUES(?,?,?,'planning')",[slug,title,summary]);
  insertId=result.insertId;
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'create','project',?,JSON_OBJECT('change',?))",[user.id,insertId,JSON.stringify({title,summary,status:"planning"})]);
  await conn.commit();
 }catch(error){try{await conn.rollback();}catch{}throw error;}finally{conn.release();}
 return NextResponse.json({id:insertId},{status:201});
}
