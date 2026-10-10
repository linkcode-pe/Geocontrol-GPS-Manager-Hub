import { NextResponse } from "next/server";
import { currentUser, sessionCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
type PasswordRow=RowDataPacket & {password_hash:string};
export async function POST(req:Request){
 if(req.headers.get("origin")!==new URL(req.url).origin)return NextResponse.json({error:"Origen no autorizado"},{status:403});
 const user=await currentUser();
 if(!user)return NextResponse.json({error:"No autorizado"},{status:401});
 let body;try{body=await req.json();}catch{return NextResponse.json({error:"Solicitud inválida"},{status:400});}
 const oldPassword=body?.oldPassword,newPassword=body?.newPassword;
 if(typeof oldPassword!=="string"||typeof newPassword!=="string"||oldPassword.length>1024||newPassword.length<12||newPassword.length>128||!/[a-z]/i.test(newPassword)||!/[0-9]/.test(newPassword))
  return NextResponse.json({error:"La nueva contraseña debe tener entre 12 y 128 caracteres e incluir letras y números"},{status:400});
 const [rows]=await db().execute<PasswordRow[]>("SELECT password_hash FROM hub_users WHERE id=? AND active=1",[user.id]);
 if(!rows[0]||!await bcrypt.compare(oldPassword,rows[0].password_hash))return NextResponse.json({error:"Contraseña actual incorrecta"},{status:403});
 const hash=await bcrypt.hash(newPassword,12);
 await db().execute("UPDATE hub_users SET password_hash=? WHERE id=?",[hash,user.id]);
 await db().execute("INSERT INTO hub_audit_log(actor_id,action,entity_type,entity_id) VALUES(?,'password_changed','user',?)",[user.id,user.id]);
 const response=NextResponse.json({ok:true});
 response.cookies.set(sessionCookie,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});
 return response;
}
