import {test} from 'node:test';
import assert from 'node:assert/strict';
import {activityCsv} from '../src/lib/activity-csv.mjs';
test('activity CSV has Excel-compatible BOM and header',()=>{const csv=activityCsv([]);assert.ok(csv.startsWith('\uFEFF"ID";"Operación"'));});
test('activity CSV escapes formulas and quotes',()=>{const csv=activityCsv([{id:1,action:'=2+2',entity_type:'task"x',entity_id:null,created_at:new Date('2026-10-11T12:00:00Z')}]);assert.ok(csv.includes('"\'=2+2"'));assert.ok(csv.includes('"task""x"'));assert.ok(csv.includes('2026-10-11T12:00:00.000Z'));});
