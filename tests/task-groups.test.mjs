import {test} from 'node:test';
import assert from 'node:assert/strict';
import {groupTasksByDue} from '../src/lib/task-groups.mjs';
test('groups tasks by overdue, today, week, future, undated and completed',()=>{const tasks=[{dueDate:'2026-10-10'},{dueDate:'2026-10-11'},{dueDate:'2026-10-18'},{dueDate:'2026-10-19'},{dueDate:null},{dueDate:'2026-10-01',done:true}];assert.deepEqual(groupTasksByDue(tasks,'2026-10-11').map(g=>g.key),['overdue','today','week','later','undated','done']);});
test('empty groups are hidden',()=>assert.deepEqual(groupTasksByDue([],'2026-10-11'),[]));
