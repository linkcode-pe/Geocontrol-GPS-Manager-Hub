import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
for(const entity of ['projects','tasks']){
 test(`${entity} update is atomic with audit`,()=>{
  const s=readFileSync(new URL(`../src/app/api/${entity}/[id]/route.ts`,import.meta.url),'utf8');
  const patch=s.slice(s.indexOf('export async function PATCH'),s.indexOf('export async function DELETE')<0?undefined:s.indexOf('export async function DELETE'));
  for(const pattern of [/const conn=await db\(\)\.getConnection\(\)/,/await conn\.beginTransaction\(\)/,/await conn\.execute<ResultSetHeader>\(/,/await conn\.execute\("INSERT INTO hub_audit_log/,/await conn\.commit\(\)/,/await conn\.rollback\(\)/,/conn\.release\(\)/])assert.match(patch,pattern);
 });
}
