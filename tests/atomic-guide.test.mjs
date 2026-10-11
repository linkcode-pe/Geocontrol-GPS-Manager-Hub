import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../src/app/api/project-guide/route.ts',import.meta.url),'utf8');
test('guide save and audit use same transaction',()=>{
 assert.ok(src.includes('const conn=await db().getConnection()'));
 assert.ok(src.includes('await conn.beginTransaction()'));
 assert.ok(src.includes("await conn.execute<ResultSetHeader>('UPDATE hub_project_guide"));
 assert.ok(src.includes('await conn.execute("INSERT INTO hub_audit_log'));
 assert.ok(src.includes('await conn.commit()'));
 assert.ok(src.includes('await conn.rollback()'));
 assert.ok(src.includes('finally{conn.release();}'));
 assert.ok(!src.includes("await db().execute('UPDATE hub_project_guide"));
});
