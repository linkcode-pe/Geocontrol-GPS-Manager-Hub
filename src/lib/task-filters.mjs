/** @typedef {{id:number,priority:string,dueDate:string|null,status:string,phase:number}} FilterTask */
/** @param {FilterTask} task @param {string} today */
const priorityRank={urgent:0,high:1,normal:2,low:3};
export function taskDueState(task,today){
 if(!task.dueDate||task.status==='done')return 'none';
 if(task.dueDate<today)return 'overdue';
 const days=Math.round((Date.parse(task.dueDate+'T00:00:00Z')-Date.parse(today+'T00:00:00Z'))/86400000);
 return days<=3?'soon':'later';
}
/** @template {FilterTask} T @param {T[]} tasks @param {{phaseId?:number|null,priority?:string,due?:string,sort?:string,today:string,phaseOptions?:{id:number}[]}} options */
export function filterSortTasks(tasks,{phaseId=null,priority='all',due='all',sort='recent',today,phaseOptions=[]}){
 const result=tasks.filter(t=>(phaseId===null||phaseOptions[t.phase]?.id===phaseId)&&(priority==='all'||t.priority===priority)&&(due==='all'||taskDueState(t,today)===due));
 return result.sort((a,b)=>{
  if(sort==='priority')return (priorityRank[a.priority]??2)-(priorityRank[b.priority]??2)||b.id-a.id;
  if(sort==='due')return (a.dueDate||'9999-12-31').localeCompare(b.dueDate||'9999-12-31')||b.id-a.id;
  return b.id-a.id;
 });
}
export function taskAlertSummary(tasks,today){
 const open=tasks.filter(t=>t.status!=='done');
 return {overdue:open.filter(t=>taskDueState(t,today)==='overdue').length,soon:open.filter(t=>taskDueState(t,today)==='soon').length,urgent:open.filter(t=>t.priority==='urgent').length};
}
