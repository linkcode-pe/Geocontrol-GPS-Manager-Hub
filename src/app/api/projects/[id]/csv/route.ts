import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

const label=(status:string)=>({planning:"Planificación",active:"En curso",paused:"Pausado",completed:"Completado",pending:"Pendiente",todo:"Pendiente",in_progress:"En curso",done:"Completada"})[status]||status;
const csv=(value:unknown)=>{const raw=String(value??"");const safe=/^[\s]*[=+@\-\t\r]/.test(raw)?`'${raw}`:raw;return `"${safe.replace(/"/g,'""')}"`;};
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 const id=Number((await params).id);if(!Number.isSafeInteger(id)||id<1)return NextResponse.json({error:"Proyecto inválido"},{status:400});
 const [projects]=await db().execute<RowDataPacket[]>("SELECT id,title,summary,status FROM hub_projects WHERE id=? LIMIT 1",[id]);
 if(!projects.length)return NextResponse.json({error:"Proyecto inexistente"},{status:404});
 const [phases]=await db().execute<RowDataPacket[]>("SELECT id,title,description,status,position FROM hub_phases WHERE project_id=? ORDER BY position,id",[id]);
 const [tasks]=await db().execute<RowDataPacket[]>("SELECT id,title,status,phase_id FROM hub_tasks WHERE project_id=? AND archived_at IS NULL ORDER BY id",[id]);
 const project=projects[0];const lines:unknown[][]=[
  ["Proyecto","Descripción del proyecto","Estado del proyecto","Fase","Descripción de fase","Estado de fase","Tarea","Estado de tarea","Avance de fase (%)"],
 ];
 for(const phase of phases){
  const related=tasks.filter(t=>Number(t.phase_id)===Number(phase.id));
  const percent=related.length?Math.round(related.filter(t=>t.status==="done").length/related.length*100):0;
  for(const task of related.length?related:[null])lines.push([project.title,project.summary,label(project.status),phase.title,phase.description,label(phase.status),task?.title||"",task?label(task.status):"",percent]);
 }
 for(const task of tasks.filter(t=>t.phase_id==null))lines.push([project.title,project.summary,label(project.status),"Sin fase","","",task.title,label(task.status),""]);
 if(lines.length===1)lines.push([project.title,project.summary,label(project.status),"","","","","",""]);
 const body="\uFEFF"+lines.map(row=>row.map(csv).join(";")).join("\r\n")+"\r\n";
 return new NextResponse(body,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":`attachment; filename="proyecto-${id}-datos.csv"`,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
}
