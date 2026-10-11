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
