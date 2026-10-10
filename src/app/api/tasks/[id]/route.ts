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
 const hasDone=typeof body?.done==="boolean";
 const hasTitle=body!==null&&typeof body==="object"&&Object.prototype.hasOwnProperty.call(body,"title");
 if(hasTitle&&(typeof body.title!=="string"||!body.title.trim()||body.title.trim().length>255))return NextResponse.json({error:"Título inválido"},{status:400});
 const hasPhase=body!==null&&typeof body==="object"&&Object.prototype.hasOwnProperty.call(body,"phaseId");
 if(!hasDone&&!hasPhase&&!hasTitle)return NextResponse.json({error:"Datos inválidos"},{status:400});
 if(hasPhase){
  if(body.phaseId!==null&&(!Number.isSafeInteger(body.phaseId)||body.phaseId<1))return NextResponse.json({error:"Fase inválida"},{status:400});
  if(body.phaseId!==null){const [valid]=await db().execute<RowDataPacket[]>("SELECT p.id FROM hub_phases p JOIN hub_tasks t ON t.project_id=p.project_id WHERE p.id=? AND t.id=? LIMIT 1",[body.phaseId,id]);if(!valid.length)return NextResponse.json({error:"Fase no pertenece al proyecto"},{status:400});}
 }
 const updates:string[]=[];const values:(string|number|null)[]=[];if(hasTitle){updates.push("title=?");values.push(body.title.trim());}if(hasPhase){updates.push("phase_id=?");values.push(body.phaseId);}if(hasDone){updates.push("status=?");values.push(body.done?"done":"todo");}values.push(id);const [result]=await db().execute<ResultSetHeader>(`UPDATE hub_tasks SET ${updates.join(", ")} WHERE id=?`,values);
 if(result.affectedRows===0)return NextResponse.json({error:"Tarea no encontrada"},{status:404});
 await db().execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'update','task',?,JSON_OBJECT('change',?))",[user.id,id,hasTitle?JSON.stringify({title:body.title.trim()}):hasPhase?JSON.stringify({phaseId:body.phaseId}):JSON.stringify({done:body.done})]);
 return NextResponse.json({ok:true});
}
export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 if(!["owner","admin","editor"].includes(user.role))return NextResponse.json({error:"Sin permisos"},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:"Origen no autorizado"},{status:403});
 const {id}=await params;if(!/^[1-9][0-9]*$/.test(id))return NextResponse.json({error:"ID inválido"},{status:400});
 const [result]=await db().execute<ResultSetHeader>("DELETE FROM hub_tasks WHERE id=?",[id]);
 if(!result.affectedRows)return NextResponse.json({error:"Tarea no encontrada"},{status:404});
 await db().execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id) VALUES(?,'delete','task',?)",[user.id,id]);
 return NextResponse.json({ok:true});
}
