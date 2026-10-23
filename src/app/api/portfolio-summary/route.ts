import {NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth';
import {db} from '@/lib/db';
import type {RowDataPacket} from 'mysql2';
export async function GET(){
 if(!await currentUser())return NextResponse.json({error:'No autorizado'},{status:401});
 const [rows]=await db().execute<RowDataPacket[]>(`SELECT p.id,p.title,p.status,
 (SELECT COUNT(*) FROM hub_phases ph WHERE ph.project_id=p.id) AS phases,
 (SELECT COUNT(*) FROM hub_phases ph WHERE ph.project_id=p.id AND ph.status='completed') AS phasesCompleted,
 (SELECT COUNT(*) FROM hub_tasks t WHERE t.project_id=p.id) AS tasks,
 (SELECT COUNT(*) FROM hub_tasks t WHERE t.project_id=p.id AND t.status='done') AS tasksCompleted,
 (SELECT COUNT(*) FROM hub_tasks t WHERE t.project_id=p.id AND t.status='in_progress') AS tasksInProgress,
 (SELECT COUNT(*) FROM hub_tasks t WHERE t.project_id=p.id AND t.status='blocked') AS tasksBlocked,
 (SELECT COUNT(*) FROM hub_documents d WHERE d.project_id=p.id AND d.archived_at IS NULL) AS documents
 FROM hub_projects p ORDER BY p.id DESC`);
 return NextResponse.json({projects:rows},{headers:{'Cache-Control':'no-store'}});
}
