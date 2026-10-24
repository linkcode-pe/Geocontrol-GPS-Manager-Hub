import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

const status=(value:string)=>({planning:"Planificación",active:"En curso",paused:"Pausado",completed:"Completado"})[value]||value;
const cell=(value:unknown)=>{const raw=String(value??"");const safe=/^\s*[=+@\-\t\r]/.test(raw)?`'${raw}`:raw;return `"${safe.replace(/"/g,'""')}"`;};
export async function GET(){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 const [projects]=await db().execute<RowDataPacket[]>(`SELECT p.id,p.title,p.summary,p.status,COUNT(DISTINCT ph.id) AS phaseCount,COUNT(DISTINCT t.id) AS taskCount,COUNT(DISTINCT CASE WHEN t.status='done' THEN t.id END) AS doneCount FROM hub_projects p LEFT JOIN hub_phases ph ON ph.project_id=p.id LEFT JOIN hub_tasks t ON t.project_id=p.id AND t.archived_at IS NULL GROUP BY p.id ORDER BY p.id DESC`);
 const rows:unknown[][]=[["Proyecto","Descripción","Estado","Fases","Tareas","Completadas","Pendientes","Avance (%)"]];
 for(const p of projects){const total=Number(p.taskCount),done=Number(p.doneCount);rows.push([p.title,p.summary,status(p.status),Number(p.phaseCount),total,done,total-done,total?Math.round(done/total*100):0]);}
 const body="\uFEFF"+rows.map(row=>row.map(cell).join(";")).join("\r\n")+"\r\n";
 return new NextResponse(body,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":"attachment; filename=geocontrol-resumen-proyectos.csv","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
}
