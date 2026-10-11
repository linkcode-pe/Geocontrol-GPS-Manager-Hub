import { NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/origin";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
export async function GET(req:Request){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 const projectId=Number(new URL(req.url).searchParams.get("projectId"));
 if(!Number.isSafeInteger(projectId)||projectId<1)return NextResponse.json({error:"Proyecto inválido"},{status:400});
 const [rows]=await db().execute<RowDataPacket[]>("SELECT id,title,status,phase_id FROM hub_tasks WHERE project_id=? ORDER BY id DESC LIMIT 200",[projectId]);
 const [phaseRows]=await db().execute<RowDataPacket[]>("SELECT id,title FROM hub_phases WHERE project_id=? ORDER BY position,id",[projectId]);
 return NextResponse.json({tasks:rows,phases:phaseRows});
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
 const phaseId=body.phaseId??null;
 if(phaseId!==null){if(!Number.isSafeInteger(phaseId)||phaseId<1)return NextResponse.json({error:"Fase inválida"},{status:400});const [valid]=await db().execute<RowDataPacket[]>("SELECT id FROM hub_phases WHERE id=? AND project_id=? LIMIT 1",[phaseId,projectId]);if(!valid.length)return NextResponse.json({error:"Fase no pertenece al proyecto"},{status:400});}
 const [result]=await db().execute("INSERT INTO hub_tasks(project_id,title,phase_id) VALUES(?,?,?)",[projectId,title,phaseId]);
 await db().execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,metadata) VALUES(?,'create','task',JSON_OBJECT('title',?))",[user.id,title]);
 return NextResponse.json({ok:true,result},{status:201});
}
