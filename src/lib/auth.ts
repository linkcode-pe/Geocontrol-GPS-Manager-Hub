import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
const cookieName = "geocontrol_hub_session";
function key(){const secret=process.env.AUTH_SECRET;if(!secret || secret.length<32) throw new Error("AUTH_SECRET is not configured");return new TextEncoder().encode(secret);}
export async function signSession(user:{id:number;email:string;role:string}) {
 return new SignJWT({email:user.email,role:user.role}).setProtectedHeader({alg:"HS256"}).setSubject(String(user.id)).setIssuedAt().setExpirationTime("8h").sign(key());
}
export async function currentUser(){
 const token=(await cookies()).get(cookieName)?.value;
 if(!token) return null;
 try {const {payload}=await jwtVerify(token,key(),{algorithms:["HS256"]});return {id:Number(payload.sub),email:String(payload.email),role:String(payload.role)};}catch{return null;}
}
export const sessionCookie=cookieName;
