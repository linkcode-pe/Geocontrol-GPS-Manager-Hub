export function weeklyPlan(tasks,today){
 const end=new Date(today+'T00:00:00Z');end.setUTCDate(end.getUTCDate()+7);
 const weekEnd=end.toISOString().slice(0,10);
 const open=tasks.filter(t=>t.status!=='done'&&!t.done);
 const overdue=open.filter(t=>t.dueDate&&t.dueDate<today);
 const todayTasks=open.filter(t=>t.dueDate===today);
 const upcoming=open.filter(t=>t.dueDate&&t.dueDate>today&&t.dueDate<=weekEnd);
 const urgent=open.filter(t=>t.priority==='urgent');
 return {overdue:overdue.length,today:todayTasks.length,upcoming:upcoming.length,urgent:urgent.length,attention:[...open].filter(t=>t.priority==='urgent'||t.dueDate&&t.dueDate<=weekEnd).sort((a,b)=>(a.dueDate||'9999-12-31').localeCompare(b.dueDate||'9999-12-31')||({urgent:0,high:1,normal:2,low:3}[a.priority]??2)-({urgent:0,high:1,normal:2,low:3}[b.priority]??2)).slice(0,5)};
}
