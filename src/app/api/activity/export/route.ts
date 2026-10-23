import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {db} from '@/lib/db';
import type {RowDataPacket} from 'mysql2';
import {parseActivityFilters} from '@/lib/activity-filters.mjs';
import {scopedActivityFilter} from '@/lib/activity-project-scope.mjs';
import {activityCsv} from '@/lib/activity-csv.mjs';
export async function GET(req:Request){
 const user=await currentUser();
 if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 const url=new URL(req.url),filters=parseActivityFilters(url.searchParams);
 if(!filters)return NextResponse.json({error:'Filtros inválidos'},{status:400});
 const {where,values}=filters;
 const scope=scopedActivityFilter(url.searchParams,where,values);
 if(!scope)return NextResponse.json({error:'Proyecto inválido'},{status:400});
 const limit=10000;
 const [events]=await db().query<RowDataPacket[]>(`SELECT a.id,a.action,a.entity_type,a.entity_id,a.created_at,a.metadata FROM hub_audit_log a${scope.where} ORDER BY a.id DESC LIMIT ?`,[...scope.values,limit+1]);
 if(events.length>limit)return NextResponse.json({error:'Demasiados registros. Reduce el rango de fechas (máximo 10000).'}, {status:413});
 return new NextResponse(activityCsv(events),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="geocontrol-actividad.csv"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}
