import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
for(const [file,verb] of [['route.ts','POST'],['[id]/route.ts','PATCH']]){
 test(`phase ${verb} uses one transaction with audit`,()=>{
  const source=readFileSync(new URL(`../src/app/api/phases/${file}`,import.meta.url),'utf8');
  const section=source.slice(source.indexOf(`export async function ${verb}`),verb==='POST'?undefined:source.indexOf('export async function DELETE'));
  for(const token of ['const conn=await db().getConnection()','await conn.beginTransaction()','await conn.execute<ResultSetHeader>','await conn.execute("INSERT INTO hub_audit_log','await conn.commit()','await conn.rollback()','conn.release()'])assert.ok(section.includes(token),token);
 });
}
