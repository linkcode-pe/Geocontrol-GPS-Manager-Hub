import { NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/origin";
import { sessionCookie } from "@/lib/auth";
export async function POST(req:Request){
 if(!isAllowedOrigin(req)) return NextResponse.json({error:"Origen no autorizado"},{status:403});
 const response=NextResponse.json({ok:true});
 response.cookies.set(sessionCookie,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});
 return response;
}
