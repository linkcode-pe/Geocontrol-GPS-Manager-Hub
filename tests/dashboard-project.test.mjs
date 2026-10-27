import test from 'node:test';
import assert from 'node:assert/strict';
import {projectDashboardSummary,dashboardTaskState} from '../src/lib/dashboard-project.mjs';

test('dashboard counts describe only the selected project',()=>{
 const projects=[{phaseCount:5,taskCount:10,doneCount:2},{phaseCount:8,taskCount:20,doneCount:15}];
 assert.deepEqual(projectDashboardSummary(projects[0]),{phases:5,tasks:10,done:2,pending:8,progress:20});
 assert.deepEqual(projectDashboardSummary(projects[1]),{phases:8,tasks:20,done:15,pending:5,progress:75});
});
test('an empty project has no pending tasks or progress',()=>{
 assert.deepEqual(projectDashboardSummary({phaseCount:0,taskCount:0,doneCount:0}),{phases:0,tasks:0,done:0,pending:0,progress:0});
});

test('switching projects hides stale tasks until the new project loads',()=>{
 assert.equal(dashboardTaskState(2,1,null),'loading');
 assert.equal(dashboardTaskState(2,2,null),'ready');
 assert.equal(dashboardTaskState(2,1,2),'error');
 assert.equal(dashboardTaskState(2,2,2),'error');
});
