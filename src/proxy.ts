import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
export async function proxy(req:NextRequest){
 const path=req.nextUrl.pathname;
 if(path.startsWith("/login")||path.startsWith("/api/auth/login"))return NextResponse.next();
 if(path.startsWith("/_next/")||path==="/favicon.ico")return NextResponse.next();
 const token=req.cookies.get("geocontrol_hub_session")?.value;
 const secret=process.env.AUTH_SECRET;
 if(token&&secret&&secret.length>=32){try{await jwtVerify(token,new TextEncoder().encode(secret),{algorithms:["HS256"]});return NextResponse.next();}catch{}}
 if(path.startsWith("/api/"))return NextResponse.json({error:"No autorizado"},{status:401});
 return NextResponse.redirect(new URL("/login",req.url));
}
export const config={matcher:["/((?!_next/static|_next/image).*)"]};
