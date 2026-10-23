import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const dialog=readFileSync(new URL('../src/app/confirm-permanent-delete.tsx',import.meta.url),'utf8');
const continuity=readFileSync(new URL('../src/app/continuidad/page.tsx',import.meta.url),'utf8');
test('permanent deletion requires exact title in modal and server request',()=>{
 assert.match(dialog,/element\.showModal\(\)/);
 assert.match(dialog,/typed===title/);
 assert.match(dialog,/disabled=\{busy\|\|typed!==title\}/);
 assert.match(continuity,/confirmation!==entry\.title/);
 assert.match(continuity,/confirmTitle:confirmation,revision:entry\.revision/);
 assert.doesNotMatch(continuity,/window\.prompt/);
});
