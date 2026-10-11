import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../src/app/page.tsx',import.meta.url),'utf8');
test('task save blocks duplicate submissions synchronously',()=>{
 assert.match(source,/savingTaskIdsRef\.current\.has\(task\.id\)\)return;savingTaskIdsRef\.current\.add\(task\.id\)/);
 assert.match(source,/finally\{savingTaskIdsRef\.current\.delete\(task\.id\)/);
});
test('task editor cannot be discarded while a save is in progress',()=>{
 assert.match(source,/function confirmTaskDiscard\(task:Task\)\{if\(savingTaskIdsRef\.current\.has\(task\.id\)\|\|updatingTaskIds\.includes\(task\.id\)\)return false/);
 assert.match(source,/className="task-cancel" disabled=\{updatingTaskIds\.includes\(t\.id\)\}/);
});
test('task editor inputs are locked and saving progress is announced',()=>{
 for(const field of ['task-name-','task-phase-','task-status-','task-priority-','task-date-']){
  assert.ok(source.includes('id={`'+field+'${t.id}`} disabled={updatingTaskIds.includes(t.id)}'));
 }
 assert.match(source,/className="task-saving-status" role="status"/);
 assert.match(source,/className="task-unified-editor" aria-busy=\{updatingTaskIds\.includes\(t\.id\)\}/);
});
