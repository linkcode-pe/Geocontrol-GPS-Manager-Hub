const labels={title:'Título',phaseId:'Fase',status:'Estado',priority:'Prioridad',dueDate:'Vencimiento',done:'Completada'};
const values={todo:'Pendiente',in_progress:'En curso',blocked:'Bloqueada',done:'Completada',low:'Baja',normal:'Normal',high:'Alta',urgent:'Urgente'};
export function activityDetails(metadata){
 if(!metadata)return '';
 let parsed=metadata;
 try{if(typeof parsed==='string')parsed=JSON.parse(parsed);}catch{return '';}
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return '';
 let change=parsed.change??parsed;
 try{if(typeof change==='string')change=JSON.parse(change);}catch{return '';}
 if(!change||typeof change!=='object'||Array.isArray(change))return '';
 return Object.entries(change).filter(([key])=>Object.hasOwn(labels,key)).map(([key,value])=>`${labels[key]}: ${value===null||value===''?'Sin asignar':typeof value==='boolean'?(value?'Sí':'No'):values[value]??String(value)}`).join(' · ').slice(0,350);
}
