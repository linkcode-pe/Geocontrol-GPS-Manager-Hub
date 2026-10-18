export function requestedProjectId():number|null{
 const raw=new URLSearchParams(window.location.search).get('projectId');
 if(!raw||!/^[1-9]\d*$/.test(raw))return null;
 const id=Number(raw);
 return Number.isSafeInteger(id)?id:null;
}
export function initialProjectId(projects:{id:number}[]):number{
 const requested=requestedProjectId();
 return projects.find(p=>p.id===requested)?.id??projects[0]?.id??0;
}
