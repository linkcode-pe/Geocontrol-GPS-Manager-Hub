import { NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/origin";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { taskPagination } from "@/lib/pagination";
export async function GET(req:Request){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 const url=new URL(req.url);
 const projectId=Number(url.searchParams.get("projectId"));
 const archived=url.searchParams.get("archived")==='1';
 const pagination=taskPagination(url.searchParams.get("page"),url.searchParams.get("limit"));
 if(!pagination)return NextResponse.json({error:"Paginación inválida"},{status:400});
 if(!Number.isSafeInteger(projectId)||projectId<1)return NextResponse.json({error:"Proyecto inválido"},{status:400});
 const [rows]=await db().execute<RowDataPacket[]>(`SELECT id,title,status,phase_id,depends_on_task_id,priority,DATE_FORMAT(due_date,'%Y-%m-%d') AS due_date,DATE_FORMAT(archived_at,'%Y-%m-%d %H:%i:%s') AS archived_at FROM hub_tasks WHERE project_id=? AND ${archived?'archived_at IS NOT NULL':'archived_at IS NULL'} ORDER BY id DESC LIMIT ${pagination.limit} OFFSET ${pagination.offset}`,[projectId]);
 const [phaseRows]=await db().execute<RowDataPacket[]>("SELECT id,title FROM hub_phases WHERE project_id=? ORDER BY position,id",[projectId]);
 return NextResponse.json({tasks:rows,phases:phaseRows,page:pagination.page,limit:pagination.limit,hasMore:rows.length===pagination.limit,archived,canRestore:['owner','admin','editor'].includes(user.role)});
}
export async function POST(req:Request){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 if(!["owner","admin","editor"].includes(user.role))return NextResponse.json({error:"Sin permisos"},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:"Origen no autorizado"},{status:403});
 let body;try{body=await req.json();}catch{return NextResponse.json({error:"JSON inválido"},{status:400});}
 const title=typeof body?.title==="string"?body.title.trim():"";
 if(!title||title.length>255)return NextResponse.json({error:"Título inválido"},{status:400});
 const projectId=body?.projectId;
 if(!Number.isSafeInteger(projectId)||projectId<1)return NextResponse.json({error:"Proyecto inválido"},{status:400});
 const [projects]=await db().execute<RowDataPacket[]>("SELECT id FROM hub_projects WHERE id=? LIMIT 1",[projectId]);
 if(!projects.length)return NextResponse.json({error:"Proyecto inexistente"},{status:404});
 const priority=body?.priority??'normal';
 if(!['low','normal','high','urgent'].includes(priority))return NextResponse.json({error:'Prioridad inválida'},{status:400});
 const dueDate=body?.dueDate??null;
 if(dueDate!==null&&(typeof dueDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)||Number.isNaN(Date.parse(dueDate))||new Date(dueDate).toISOString().slice(0,10)!==dueDate))return NextResponse.json({error:'Fecha inválida'},{status:400});
 const phaseId=body.phaseId??null;
 if(phaseId!==null){if(!Number.isSafeInteger(phaseId)||phaseId<1)return NextResponse.json({error:"Fase inválida"},{status:400});const [valid]=await db().execute<RowDataPacket[]>("SELECT id FROM hub_phases WHERE id=? AND project_id=? LIMIT 1",[phaseId,projectId]);if(!valid.length)return NextResponse.json({error:"Fase no pertenece al proyecto"},{status:400});}
 const conn=await db().getConnection();
 let insertId:number;
 try{
  await conn.beginTransaction();
  const [result]=await conn.execute<ResultSetHeader>("INSERT INTO hub_tasks(project_id,title,phase_id,priority,due_date) VALUES(?,?,?,?,?)",[projectId,title,phaseId,priority,dueDate]);
  insertId=result.insertId;
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'create','task',?,JSON_OBJECT('change',?))",[user.id,insertId,JSON.stringify({title,phaseId,priority,dueDate,status:"todo"})]);
  await conn.commit();
 }catch(error){try{await conn.rollback();}catch{}throw error;}finally{conn.release();}
 return NextResponse.json({ok:true,result:{insertId}},{status:201});
}
