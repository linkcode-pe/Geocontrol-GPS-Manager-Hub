import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
const cookieName = "geocontrol_hub_session";
function key(){const secret=process.env.AUTH_SECRET;if(!secret || secret.length<32) throw new Error("AUTH_SECRET is not configured");return new TextEncoder().encode(secret);}
export async function signSession(user:{id:number;email:string;role:string}) {
 return new SignJWT({email:user.email,role:user.role}).setProtectedHeader({alg:"HS256"}).setSubject(String(user.id)).setIssuedAt().setExpirationTime("8h").sign(key());
}
type UserRow=RowDataPacket & {id:number;email:string;role:string;active:number};
export async function currentUser(){
 const token=(await cookies()).get(cookieName)?.value;
 if(!token)return null;
 try{
  const {payload}=await jwtVerify(token,key(),{algorithms:["HS256"]});
  const id=Number(payload.sub);
  if(!Number.isSafeInteger(id)||id<1)return null;
  const [rows]=await db().execute<UserRow[]>("SELECT id,email,role,active FROM hub_users WHERE id=? LIMIT 1",[id]);
  const user=rows[0];
  return user?.active?{id:user.id,email:user.email,role:user.role}:null;
 }catch{return null;}
}
export const sessionCookie=cookieName;
