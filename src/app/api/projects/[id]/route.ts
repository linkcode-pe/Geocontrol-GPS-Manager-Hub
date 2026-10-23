import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { isAllowedOrigin } from "@/lib/origin";
import { db } from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 if(!["owner","admin","editor"].includes(user.role))return NextResponse.json({error:"Sin permisos"},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:"Origen no autorizado"},{status:403});
 const id=Number((await params).id);if(!Number.isSafeInteger(id)||id<1)return NextResponse.json({error:"Proyecto inválido"},{status:400});
 let body;try{body=await req.json();}catch{return NextResponse.json({error:"JSON inválido"},{status:400});}
 const updates:string[]=[];const values:(string|number)[]=[];const change:Record<string,string>={};
 if(Object.hasOwn(body,"title")){if(typeof body.title!=="string"||!body.title.trim()||body.title.trim().length>255)return NextResponse.json({error:"Nombre inválido"},{status:400});updates.push("title=?");values.push(body.title.trim());change.title=body.title.trim();}
 if(Object.hasOwn(body,"summary")){if(typeof body.summary!=="string"||body.summary.length>5000)return NextResponse.json({error:"Descripción inválida"},{status:400});updates.push("summary=?");values.push(body.summary.trim());change.summary=body.summary.trim();}
 if(Object.hasOwn(body,"status")){if(!["planning","active","paused","completed"].includes(body.status))return NextResponse.json({error:"Estado inválido"},{status:400});updates.push("status=?");values.push(body.status);change.status=body.status;}
 if(!updates.length)return NextResponse.json({error:"Sin cambios"},{status:400});
 values.push(id);
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [result]=await conn.execute<ResultSetHeader>(`UPDATE hub_projects SET ${updates.join(",")} WHERE id=?`,values);
  if(!result.affectedRows){await conn.rollback();return NextResponse.json({error:"Proyecto no encontrado"},{status:404});}
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'update','project',?,JSON_OBJECT('change',?))",[user.id,id,JSON.stringify(change)]);
  await conn.commit();
 }catch(error){try{await conn.rollback();}catch{}throw error;}finally{conn.release();}
 return NextResponse.json({ok:true});
}

// Deletion is intentionally limited to empty projects: several relations use ON DELETE CASCADE.
export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 if(!["owner","admin"].includes(user.role))return NextResponse.json({error:"Solo un administrador puede eliminar proyectos"},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:"Origen no autorizado"},{status:403});
 const id=Number((await params).id);if(!Number.isSafeInteger(id)||id<1)return NextResponse.json({error:"Proyecto inválido"},{status:400});
 let body:unknown;try{body=await req.json();}catch{return NextResponse.json({error:"Confirmación inválida"},{status:400});}
 const confirmation=(body&&typeof body==="object"&&"confirmTitle" in body)?(body as {confirmTitle:unknown}).confirmTitle:null;
 if(typeof confirmation!=="string")return NextResponse.json({error:"Confirma el nombre exacto del proyecto"},{status:400});
 const conn=await db().getConnection();
 try{
  await conn.beginTransaction();
  const [projects]=await conn.execute<import("mysql2").RowDataPacket[]>("SELECT title FROM hub_projects WHERE id=? FOR UPDATE",[id]);
  if(!projects.length){await conn.rollback();return NextResponse.json({error:"Proyecto no encontrado"},{status:404});}
  if(confirmation!==projects[0].title){await conn.rollback();return NextResponse.json({error:"El nombre de confirmación no coincide"},{status:400});}
  // Include version/history tables, even those without a direct foreign key.
  const dependencies=[
   ["hub_phases","fases"],["hub_tasks","tareas"],["hub_documents","documentos"],
   ["hub_project_continuity","registros de continuidad"],["hub_project_memories","memorias"],
   ["hub_project_memory_versions","versiones de memorias"],
   ["hub_project_technical_sheets","fichas técnicas"],
   ["hub_project_technical_sheet_versions","versiones de fichas técnicas"]
  ] as const;
  const blockers:string[]=[];
  for(const [table,label] of dependencies){
   const [rows]=await conn.execute<import("mysql2").RowDataPacket[]>(`SELECT COUNT(*) AS total FROM ${table} WHERE project_id=?`,[id]);
   const total=Number(rows[0]?.total||0);
   if(total)blockers.push(`${total} ${label}`);
  }
  if(blockers.length){
   await conn.rollback();
   return NextResponse.json({error:`No se puede eliminar este proyecto porque conserva: ${blockers.join(", ")}. Revisa esa información antes de intentar eliminarlo.`,blockers},{status:409});
  }
  const [result]=await conn.execute<ResultSetHeader>("DELETE FROM hub_projects WHERE id=?",[id]);
  if(result.affectedRows!==1)throw new Error("No se pudo eliminar el proyecto");
  await conn.execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'delete','project',?,JSON_OBJECT('change',?))",[user.id,id,JSON.stringify({title:projects[0].title,empty:true})]);
  await conn.commit();
 }catch(error){try{await conn.rollback();}catch{}throw error;}finally{conn.release();}
 return NextResponse.json({ok:true});
}
