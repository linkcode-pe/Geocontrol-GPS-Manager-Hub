import test from 'node:test';
import assert from 'node:assert/strict';
import {scopedActivityFilter} from '../src/lib/activity-project-scope.mjs';
test('activity scope preserves global view without a project',()=>{
 assert.deepEqual(scopedActivityFilter(new URLSearchParams(),' WHERE a.action=?',['create']),{where:' WHERE a.action=?',values:['create']});
});
test('activity scope filters project entities with parameterized IDs',()=>{
 const r=scopedActivityFilter(new URLSearchParams('projectId=4'),' WHERE a.action=?',['update']);
 assert.match(r.where,/hub_tasks/);assert.match(r.where,/hub_project_continuity/);
 assert.deepEqual(r.values,['update',4,4,4,4,4]);
});
test('activity scope rejects invalid project IDs',()=>{
 for(const id of ['0','-1','1.5','abc','99999999999999999999'])assert.equal(scopedActivityFilter(new URLSearchParams({projectId:id}),'',[]),null);
});
