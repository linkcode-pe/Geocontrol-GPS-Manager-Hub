import {test} from 'node:test';
import assert from 'node:assert/strict';
import {weeklyPlan} from '../src/lib/weekly-plan.mjs';
test('weekly plan counts deadlines and urgent tasks without completed items',()=>{const tasks=[{id:1,dueDate:'2026-10-10',priority:'normal',status:'todo'},{id:2,dueDate:'2026-10-11',priority:'urgent',status:'todo'},{id:3,dueDate:'2026-10-18',priority:'high',status:'blocked'},{id:4,dueDate:'2026-10-19',priority:'urgent',status:'todo'},{id:5,dueDate:'2026-10-09',priority:'urgent',status:'done'}];const plan=weeklyPlan(tasks,'2026-10-11');assert.deepEqual([plan.overdue,plan.today,plan.upcoming,plan.urgent],[1,1,1,2]);assert.deepEqual(plan.attention.map(t=>t.id),[1,2,3,4]);});
