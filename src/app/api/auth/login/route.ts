import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signSession, sessionCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
type UserRow=RowDataPacket & {id:number;email:string;role:string;password_hash:string;active:number};
export async function POST(req:Request){
 try{
 const body=await req.json();
 const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
 const password=typeof body.password==="string"?body.password:"";
 if(!email || password.length>1024 || !password) return NextResponse.json({error:"Credenciales inválidas"},{status:401});
 const [rows]=await db().execute<UserRow[]>("SELECT id,email,role,password_hash,active FROM hub_users WHERE email=? LIMIT 1",[email]);
 const user=rows[0];
 const valid=user?.active && await bcrypt.compare(password,user.password_hash);
 if(!valid) return NextResponse.json({error:"Credenciales inválidas"},{status:401});
 const token=await signSession(user);
 const response=NextResponse.json({ok:true});
 response.cookies.set(sessionCookie,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:8*3600});
 return response;
 }catch{return NextResponse.json({error:"No se pudo iniciar sesión"},{status:500});}
}
