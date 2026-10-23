import { NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/origin";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 if(!["owner","admin","editor"].includes(user.role))return NextResponse.json({error:"Sin permisos"},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:"Origen no autorizado"},{status:403});
 const {id}=await params;if(!/^[1-9][0-9]*$/.test(id))return NextResponse.json({error:"ID inválido"},{status:400});
 let body;try{body=await req.json();}catch{return NextResponse.json({error:"JSON inválido"},{status:400});}
 const hasPriority=body!==null&&typeof body==='object'&&Object.hasOwn(body,'priority');
 if(hasPriority&&!['low','normal','high','urgent'].includes(body.priority))return NextResponse.json({error:'Prioridad inválida'},{status:400});
 const hasDueDate=body!==null&&typeof body==='object'&&Object.hasOwn(body,'dueDate');
 if(hasDueDate&&body.dueDate!==null&&(typeof body.dueDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate)||Number.isNaN(Date.parse(body.dueDate))||new Date(body.dueDate).toISOString().slice(0,10)!==body.dueDate))return NextResponse.json({error:'Fecha inválida'},{status:400});
 const hasDone=typeof body?.done==="boolean";
 const hasStatus=typeof body?.status==="string";
 if(hasStatus&&!["todo","in_progress","blocked","done"].includes(body.status))return NextResponse.json({error:"Estado inválido"},{status:400});
 if(hasDone&&hasStatus)return NextResponse.json({error:"Estado duplicado"},{status:400});
 const hasTitle=body!==null&&typeof body==="object"&&Object.prototype.hasOwnProperty.call(body,"title");
 if(hasTitle&&(typeof body.title!=="string"||!body.title.trim()||body.title.trim().length>255))return NextResponse.json({error:"Título inválido"},{status:400});
 const hasPhase=body!==null&&typeof body==="object"&&Object.prototype.hasOwnProperty.call(body,"phaseId");
 if(!hasDone&&!hasStatus&&!hasPhase&&!hasTitle&&!hasPriority&&!hasDueDate&&!Object.hasOwn(body??{},"dependsOnTaskId"))return NextResponse.json({error:"Datos inválidos"},{status:400});
 if(hasPhase){
  if(body.phaseId!==null&&(!Number.isSafeInteger(body.phaseId)||body.phaseId<1))return NextResponse.json({error:"Fase inválida"},{status:400});
  if(body.phaseId!==null){const [valid]=await db().execute<RowDataPacket[]>("SELECT p.id FROM hub_phases p JOIN hub_tasks t ON t.project_id=p.project_id WHERE p.id=? AND t.id=? LIMIT 1",[body.phaseId,id]);if(!valid.length)return NextResponse.json({error:"Fase no pertenece al proyecto"},{status:400});}
 }
 const hasDependency=body!==null&&typeof body==='object'&&Object.hasOwn(body,'dependsOnTaskId');
 if(hasDependency&&body.dependsOnTaskId!==null&&(!Number.isSafeInteger(body.dependsOnTaskId)||body.dependsOnTaskId<1))return NextResponse.json({error:"Dependencia inválida"},{status:400});
 if(hasDependency&&body.dependsOnTaskId===Number(id))return NextResponse.json({error:"Una tarea no puede depender de sí misma"},{status:400});
 if(hasDependency&&body.dependsOnTaskId!==null){
  const [target]=await db().execute<RowDataPacket[]>("SELECT predecessor.project_id FROM hub_tasks predecessor JOIN hub_tasks current ON current.project_id=predecessor.project_id WHERE predecessor.id=? AND current.id=?",[body.dependsOnTaskId,id]);
  if(!target.length)return NextResponse.json({error:"La dependencia debe pertenecer al mismo proyecto"},{status:400});
  // A single-predecessor chain must never contain a cycle.
  const [chain]=await db().execute<RowDataPacket[]>(`WITH RECURSIVE ancestors AS (
    SELECT id,depends_on_task_id FROM hub_tasks WHERE id=?
    UNION ALL SELECT t.id,t.depends_on_task_id FROM hub_tasks t JOIN ancestors a ON t.id=a.depends_on_task_id
  ) SELECT id FROM ancestors LIMIT 1001`,[body.dependsOnTaskId]);
  if(chain.some(row=>Number(row.id)===Number(id)))return NextResponse.json({error:"La dependencia crearía un ciclo"},{status:400});
  if(chain.length>1000)return NextResponse.json({error:"Cadena de dependencias demasiado larga"},{status:400});
 }
 const updates:string[]=[];const values:(string|number|null)[]=[];if(hasDependency){updates.push("depends_on_task_id=?");values.push(body.dependsOnTaskId);}if(hasPriority){updates.push("priority=?");values.push(body.priority);}if(hasDueDate){updates.push("due_date=?");values.push(body.dueDate);}if(hasTitle){updates.push("title=?");values.push(body.title.trim());}if(hasPhase){updates.push("phase_id=?");values.push(body.phaseId);}if(hasDone||hasStatus){updates.push("status=?");values.push(hasStatus?body.status:body.done?"done":"todo");}values.push(id);
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [result]=await conn.execute<ResultSetHeader>(`UPDATE hub_tasks SET ${updates.join(", ")} WHERE id=?`,values);
  if(result.affectedRows===0){await conn.rollback();return NextResponse.json({error:"Tarea no encontrada"},{status:404});}
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'update','task',?,JSON_OBJECT('change',?))",[user.id,id,JSON.stringify({...hasTitle?{title:body.title.trim()}: {},...hasDependency?{dependsOnTaskId:body.dependsOnTaskId}:{},...hasPhase?{phaseId:body.phaseId}:{},...hasPriority?{priority:body.priority}:{},...hasDueDate?{dueDate:body.dueDate}:{},...hasStatus?{status:body.status}:hasDone?{done:body.done}:{}})]);
  await conn.commit();
 }catch(error){try{await conn.rollback();}catch{}throw error;}finally{conn.release();}
 return NextResponse.json({ok:true});
}
export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 if(!["owner","admin","editor"].includes(user.role))return NextResponse.json({error:"Sin permisos"},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:"Origen no autorizado"},{status:403});
 const {id}=await params;if(!/^[1-9][0-9]*$/.test(id))return NextResponse.json({error:"ID inválido"},{status:400});
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [existing]=await conn.execute<RowDataPacket[]>("SELECT title FROM hub_tasks WHERE id=? FOR UPDATE",[id]);
  if(!existing.length){await conn.rollback();return NextResponse.json({error:"Tarea no encontrada"},{status:404});}
  const [result]=await conn.execute<ResultSetHeader>("DELETE FROM hub_tasks WHERE id=?",[id]);
  if(!result.affectedRows){await conn.rollback();return NextResponse.json({error:"Tarea no encontrada"},{status:404});}
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'delete','task',?,JSON_OBJECT('change',?))",[user.id,id,JSON.stringify({title:existing[0].title})]);
  await conn.commit();
 }catch(error){try{await conn.rollback();}catch{}throw error;}finally{conn.release();}
 return NextResponse.json({ok:true});
}
