import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {db} from '@/lib/db';
import type {RowDataPacket} from 'mysql2';

type Version=RowDataPacket & {revision:number;updated_by:number|null;created_at:Date};
export async function GET(req:Request){
 const user=await currentUser();if(!user)return NextResponse.json({error:'No autorizado'},{status:401});
 const url=new URL(req.url);
 const revisionParam=url.searchParams.get('revision');
 if(revisionParam!==null){
  if(!/^[1-9][0-9]*$/.test(revisionParam)||!Number.isSafeInteger(Number(revisionParam)))return NextResponse.json({error:'Versión inválida'},{status:400});
  const [rows]=await db().execute<RowDataPacket[]>('SELECT revision,content,updated_by,created_at FROM hub_project_guide_versions WHERE guide_id=1 AND revision=?',[Number(revisionParam)]);
  if(!rows.length)return NextResponse.json({error:'Versión no encontrada'},{status:404});
  return NextResponse.json({version:rows[0]});
 }
 const [rows]=await db().execute<Version[]>('SELECT revision,updated_by,created_at FROM hub_project_guide_versions WHERE guide_id=1 ORDER BY revision DESC LIMIT 100');
 return NextResponse.json({versions:rows});
}
