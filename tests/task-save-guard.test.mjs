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
