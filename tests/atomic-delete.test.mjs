import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
for(const entity of ['tasks','phases']){
 test(`${entity} deletion locks record and atomically audits`,()=>{
  const s=readFileSync(new URL(`../src/app/api/${entity}/[id]/route.ts`,import.meta.url),'utf8');
  const del=s.slice(s.indexOf('export async function DELETE'));
  for(const token of ['const conn=await db().getConnection()','await conn.beginTransaction()','FOR UPDATE','await conn.execute<ResultSetHeader>("DELETE FROM','await conn.execute("INSERT INTO hub_audit_log','await conn.commit()','await conn.rollback()','conn.release()'])assert.ok(del.includes(token),token);
 });
}
