import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {db} from '@/lib/db';
import type {RowDataPacket} from 'mysql2';
export async function GET(req:Request){
 const user=await currentUser();
 if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 const url=new URL(req.url);
 const pageRaw=url.searchParams.get('page')??'1';
 if(!/^[1-9]\d*$/.test(pageRaw)||Number(pageRaw)>10000)return NextResponse.json({error:'Página inválida'},{status:400});
 const page=Number(pageRaw),limit=30,offset=(page-1)*limit;
 const [rows]=await db().query<RowDataPacket[]>(`SELECT a.id,a.action,a.entity_type,a.entity_id,a.created_at,u.display_name AS actor FROM hub_audit_log a LEFT JOIN hub_users u ON u.id=a.actor_id ORDER BY a.id DESC LIMIT ? OFFSET ?`,[limit+1,offset]);
 return NextResponse.json({events:rows.slice(0,limit),page,hasMore:rows.length>limit},{headers:{'Cache-Control':'no-store'}});
}
