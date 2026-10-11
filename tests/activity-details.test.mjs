import {test} from 'node:test';
import assert from 'node:assert/strict';
import {activityDetails} from '../src/lib/activity-details.mjs';
test('activity details render all edited fields',()=>{const value=activityDetails({change:JSON.stringify({title:'Revisión',priority:'urgent',dueDate:'2026-12-15',status:'in_progress'})});assert.match(value,/Título: Revisión/);assert.match(value,/Prioridad: Urgente/);assert.match(value,/Vencimiento: 2026-12-15/);assert.match(value,/Estado: En curso/);});
test('activity details handle legacy or invalid metadata',()=>{assert.equal(activityDetails(null),'');assert.equal(activityDetails('{broken'),'');assert.equal(activityDetails({change:'{"done":true}'}),'Completada: Sí');});
