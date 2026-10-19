import {test} from 'node:test';
import assert from 'node:assert/strict';
import {taskDueState,filterSortTasks} from '../src/lib/task-filters.mjs';
const today='2026-10-11';
const tasks=[{id:1,priority:'low',dueDate:'2026-10-10',status:'todo',phase:0},{id:2,priority:'urgent',dueDate:'2026-10-12',status:'todo',phase:1},{id:3,priority:'high',dueDate:'2026-10-10',status:'done',phase:0},{id:4,priority:'normal',dueDate:null,status:'blocked',phase:-1}];
test('overdue and upcoming ignore completed tasks',()=>{assert.equal(taskDueState(tasks[0],today),'overdue');assert.equal(taskDueState(tasks[1],today),'soon');assert.equal(taskDueState(tasks[2],today),'none');assert.equal(taskDueState(tasks[3],today),'none');});
test('priority and due date sorting',()=>{assert.deepEqual(filterSortTasks(tasks,{sort:'priority',today}).map(t=>t.id),[2,3,4,1]);assert.deepEqual(filterSortTasks(tasks,{sort:'due',today}).map(t=>t.id),[3,1,2,4]);});
test('phase, priority and overdue filters',()=>{const phaseOptions=[{id:10},{id:20}];assert.deepEqual(filterSortTasks(tasks,{phaseId:10,priority:'low',due:'overdue',today,phaseOptions}).map(t=>t.id),[1]);});
import {taskAlertSummary} from '../src/lib/task-filters.mjs';
test('dashboard alerts count only unfinished tasks',()=>{
 assert.deepEqual(taskAlertSummary(tasks,today),{overdue:1,soon:1,urgent:1});
 assert.deepEqual(taskAlertSummary([],today),{overdue:0,soon:0,urgent:0});
});

import {dashboardNextTasks} from '../src/lib/task-filters.mjs';
test('dashboard next tasks prioritizes overdue, upcoming and urgency without completed tasks',()=>{
 const list=[
  {id:1,status:'todo',priority:'low',dueDate:null},
  {id:2,status:'todo',priority:'normal',dueDate:'2026-10-14'},
  {id:3,status:'todo',priority:'urgent',dueDate:'2026-10-10'},
  {id:4,status:'done',priority:'urgent',dueDate:'2026-10-01'},
  {id:5,status:'blocked',priority:'high',dueDate:'2026-10-12'},
  {id:6,status:'todo',priority:'urgent',dueDate:null},
 ];
 assert.deepEqual(dashboardNextTasks(list,today).map(t=>t.id),[3,5,2,6]);
 assert.deepEqual(dashboardNextTasks(list,today,2).map(t=>t.id),[3,5]);
 assert.deepEqual(dashboardNextTasks([],today),[]);
 assert.deepEqual(list.map(t=>t.id),[1,2,3,4,5,6]);
});
