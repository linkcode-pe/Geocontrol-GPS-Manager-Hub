export function scopedActivityFilter(params,where,values){
 const raw=params.get('projectId');
 if(raw===null)return {where,values};
 if(!/^[1-9]\d*$/.test(raw)||!Number.isSafeInteger(Number(raw)))return null;
 const id=Number(raw);
 const filter=`((a.entity_type='project' AND a.entity_id=?)
 OR (a.entity_type='phase' AND EXISTS(SELECT 1 FROM hub_phases ph WHERE ph.id=a.entity_id AND ph.project_id=?))
 OR (a.entity_type='task' AND EXISTS(SELECT 1 FROM hub_tasks t WHERE t.id=a.entity_id AND t.project_id=?))
 OR (a.entity_type='document' AND EXISTS(SELECT 1 FROM hub_documents d WHERE d.id=a.entity_id AND d.project_id=?))
 OR (a.entity_type='project_continuity' AND EXISTS(SELECT 1 FROM hub_project_continuity c WHERE c.id=a.entity_id AND c.project_id=?)))`;
 return {where:where+(where?' AND ':' WHERE ')+filter,values:[...values,id,id,id,id,id]};
}
