import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
for(const entity of ['projects','tasks']){
 test(`${entity} creation uses one transaction for entity and audit`,()=>{
  const s=readFileSync(new URL(`../src/app/api/${entity}/route.ts`,import.meta.url),'utf8');
  const post=s.slice(s.indexOf('export async function POST'));
  assert.match(post,/const conn=await db\(\)\.getConnection\(\)/);
  assert.match(post,/await conn\.beginTransaction\(\)/);
  assert.match(post,/await conn\.execute<ResultSetHeader>\("INSERT INTO hub_/);
  assert.match(post,/await conn\.execute\("INSERT INTO hub_audit_log/);
  assert.match(post,/await conn\.commit\(\)/);
  assert.match(post,/catch\(error\)\{try\{await conn\.rollback\(\)/);
  assert.match(post,/finally\{conn\.release\(\)/);
 });
}
