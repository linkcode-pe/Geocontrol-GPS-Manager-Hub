/** Counts are supplied for one selected project by the project summary API. */
export function projectDashboardSummary(project){
 const phases=Number(project?.phaseCount)||0;
 const tasks=Number(project?.taskCount)||0;
 const done=Number(project?.doneCount)||0;
 return {phases,tasks,done,pending:Math.max(0,tasks-done),progress:tasks?Math.round(done/tasks*100):0};
}

/** Never display another project's tasks while the current request is pending. */
export function dashboardTaskState(selectedProjectId,loadedProjectId,failedProjectId){
 if(failedProjectId===selectedProjectId)return 'error';
 return loadedProjectId===selectedProjectId?'ready':'loading';
}
