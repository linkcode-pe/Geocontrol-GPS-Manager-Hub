import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const taskRoute=readFileSync(new URL('../src/app/api/tasks/[id]/route.ts',import.meta.url),'utf8');
const phaseRoute=readFileSync(new URL('../src/app/api/phases/[id]/route.ts',import.meta.url),'utf8');
test('task removal archives transactionally and supports restoration',()=>{
 const del=taskRoute.slice(taskRoute.indexOf('export async function DELETE'));
 for(const token of ['await conn.beginTransaction()','FOR UPDATE','depends_on_task_id=?','UPDATE hub_tasks SET archived_at=CURRENT_TIMESTAMP,archived_by=?',"VALUES(?,'archive','task',?",'await conn.commit()','await conn.rollback()','conn.release()'])assert.ok(del.includes(token),token);
 const restore=taskRoute.slice(taskRoute.indexOf("if(body?.action==='restore')"),taskRoute.indexOf(' const hasPriority='));
 for(const token of ['await conn.beginTransaction()','FOR UPDATE','UPDATE hub_tasks SET archived_at=NULL,archived_by=NULL',"VALUES(?,'restore','task',?",'await conn.commit()','await conn.rollback()','conn.release()'])assert.ok(restore.includes(token),token);
});
test('phase deletion remains guarded and atomically audited',()=>{
 const del=phaseRoute.slice(phaseRoute.indexOf('export async function DELETE'));
 for(const token of ['await conn.beginTransaction()','FOR UPDATE','await conn.execute<ResultSetHeader>("DELETE FROM','await conn.execute("INSERT INTO hub_audit_log','await conn.commit()','await conn.rollback()','conn.release()'])assert.ok(del.includes(token),token);
});
