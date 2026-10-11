import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const paths=['src/app/api/projects/route.ts','src/app/api/projects/[id]/route.ts','src/app/api/phases/route.ts','src/app/api/phases/[id]/route.ts','src/app/api/tasks/route.ts','src/app/api/tasks/[id]/route.ts'];
for(const path of paths){
 const src=readFileSync(new URL('../'+path,import.meta.url),'utf8');
 test(`${path} protects mutations by role and origin`,()=>{
  assert.match(src,/\["owner","admin","editor"\]\.includes\(user\.role\)/);
  assert.match(src,/isAllowedOrigin\(req\)/);
  assert.match(src,/currentUser\(\)/);
 });
}
test('task API restricts statuses',()=>{
 const src=readFileSync(new URL('../src/app/api/tasks/[id]/route.ts',import.meta.url),'utf8');
 for(const status of ['todo','in_progress','blocked','done'])assert.ok(src.includes(`"${status}"`));
});
