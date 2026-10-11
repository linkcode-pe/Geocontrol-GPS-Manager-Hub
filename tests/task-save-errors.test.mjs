import {test} from 'node:test';
import assert from 'node:assert/strict';
import {taskSaveErrorMessage,taskSaveNetworkErrorMessage} from '../src/lib/task-save-errors.mjs';

test('expired session gives actionable task-save feedback',()=>{
 assert.match(taskSaveErrorMessage(401),/sesión ha caducado/);
});
test('permission rejection is explained',()=>{
 assert.match(taskSaveErrorMessage(403),/permiso/);
});
test('missing task advises preserving edits',()=>{
 assert.match(taskSaveErrorMessage(404),/Copia tus cambios/);
});
test('other HTTP failures invite retry',()=>{
 for(const status of [400,409,429,500,503])assert.match(taskSaveErrorMessage(status),/inténtalo de nuevo/);
});
test('network failure confirms edits stay in editor',()=>{
 assert.match(taskSaveNetworkErrorMessage(),/permanecen en el editor/);
});
