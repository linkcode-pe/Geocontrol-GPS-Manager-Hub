import { NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/origin";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ResultSetHeader } from "mysql2";
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 const user=await currentUser();if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 if(!["owner","admin","editor"].includes(user.role))return NextResponse.json({error:"Sin permisos"},{status:403});
 if(!isAllowedOrigin(req))return NextResponse.json({error:"Origen no autorizado"},{status:403});
 const {id}=await params;if(!/^[1-9][0-9]*$/.test(id))return NextResponse.json({error:"ID inválido"},{status:400});
 let body;try{body=await req.json();}catch{return NextResponse.json({error:"JSON inválido"},{status:400});}
 if(typeof body?.done!=="boolean")return NextResponse.json({error:"Estado inválido"},{status:400});
 const [result]=await db().execute<ResultSetHeader>("UPDATE hub_tasks SET status=? WHERE id=?",[body.done?"done":"todo",id]);
 if(result.affectedRows===0)return NextResponse.json({error:"Tarea no encontrada"},{status:404});
 await db().execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id,metadata) VALUES(?,'update','task',?,JSON_OBJECT('done',?))",[user.id,id,body.done]);
 return NextResponse.json({ok:true});
}
