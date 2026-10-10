import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/auth";
export async function POST(req:Request){
 const origin=new URL(req.url).origin;
 if(req.headers.get("origin")!==origin) return NextResponse.json({error:"Origen no autorizado"},{status:403});
 const response=NextResponse.json({ok:true});
 response.cookies.set(sessionCookie,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});
 return response;
}
