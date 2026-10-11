export function groupTasksByDue(tasks,today){
 const end=new Date(today+'T00:00:00Z');end.setUTCDate(end.getUTCDate()+7);
 const weekEnd=end.toISOString().slice(0,10);
 const groups=[{key:'overdue',title:'Vencidas',tasks:[]},{key:'today',title:'Vencen hoy',tasks:[]},{key:'week',title:'Próximos 7 días',tasks:[]},{key:'later',title:'Más adelante',tasks:[]},{key:'undated',title:'Sin vencimiento',tasks:[]},{key:'done',title:'Completadas',tasks:[]}];
 for(const task of tasks){const date=task.dueDate;const key=task.done?'done':!date?'undated':date<today?'overdue':date===today?'today':date<=weekEnd?'week':'later';groups.find(g=>g.key===key).tasks.push(task);}
 return groups.filter(g=>g.tasks.length);
}
