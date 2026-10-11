import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export function loginAttemptKey(email:string, ip:string){
 const secret=process.env.AUTH_SECRET;
 if(!secret||secret.length<32)throw new Error("AUTH_SECRET is not configured");
 return createHash("sha256").update(`${secret}\0${email.trim().toLowerCase()}\0${ip}`).digest("hex");
}
export function loginClientIp(req:Request){
 // Only the trusted Nginx proxy sets X-Real-IP; application listens on loopback.
 return (req.headers.get("x-real-ip")||"unknown").slice(0,64);
}
export async function loginIsBlocked(key:string){
 const [rows]=await db().execute<RowDataPacket[]>("SELECT failures,window_started FROM hub_login_attempts WHERE attempt_key=?",[key]);
 const row=rows[0];
 return !!row&&Number(row.failures)>=5&&Date.now()-new Date(row.window_started).getTime()<15*60*1000;
}
export async function loginFailed(key:string){
 await db().execute("INSERT INTO hub_login_attempts(attempt_key,failures,window_started) VALUES(?,1,NOW()) ON DUPLICATE KEY UPDATE failures=IF(window_started<NOW()-INTERVAL 15 MINUTE,1,failures+1),window_started=IF(window_started<NOW()-INTERVAL 15 MINUTE,NOW(),window_started)",[key]);
}
export async function loginSucceeded(key:string){await db().execute("DELETE FROM hub_login_attempts WHERE attempt_key=?",[key]);}
