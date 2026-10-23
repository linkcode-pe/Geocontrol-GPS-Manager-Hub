import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {db} from '@/lib/db';
import type {RowDataPacket} from 'mysql2';
import {parseActivityFilters} from '@/lib/activity-filters.mjs';
import {scopedActivityFilter} from '@/lib/activity-project-scope.mjs';
export async function GET(req:Request){
 const user=await currentUser();
 if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 const url=new URL(req.url);
 const filters=parseActivityFilters(url.searchParams);
 if(!filters)return NextResponse.json({error:'Filtros inválidos'},{status:400});
 const {page,where,values}=filters,limit=30,offset=(page-1)*limit;
 const scope=scopedActivityFilter(url.searchParams,where,values);
 if(!scope)return NextResponse.json({error:'Proyecto inválido'},{status:400});
 const [rows]=await db().query<RowDataPacket[]>(`SELECT a.id,a.action,a.entity_type,a.entity_id,a.created_at,a.metadata FROM hub_audit_log a${scope.where} ORDER BY a.id DESC LIMIT ? OFFSET ?`,[...scope.values,limit+1,offset]);
 return NextResponse.json({events:rows.slice(0,limit),page,hasMore:rows.length>limit},{headers:{'Cache-Control':'no-store'}});
}
