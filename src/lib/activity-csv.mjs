import {activityDetails} from './activity-details.mjs';
const cell=value=>{const raw=String(value??'');const safe=/^\s*[=+@\-\t\r]/.test(raw)?"'"+raw:raw;return '"'+safe.replace(/"/g,'""')+'"';};
export function activityCsv(events){
 const rows=[['ID','Operación','Elemento','ID del elemento','Fecha (UTC)','Detalle']];
 for(const e of events)rows.push([e.id,e.action,e.entity_type,e.entity_id??'',e.created_at instanceof Date?e.created_at.toISOString():String(e.created_at),activityDetails(e.metadata)]);
 return '\uFEFF'+rows.map(row=>row.map(cell).join(';')).join('\r\n')+'\r\n';
}
