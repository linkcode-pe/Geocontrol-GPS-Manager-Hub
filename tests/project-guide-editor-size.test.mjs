import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const editor=readFileSync(new URL('../src/app/guia-proyecto/guide-editor.tsx',import.meta.url),'utf8');
const validation=readFileSync(new URL('../src/lib/project-guide-validation.ts',import.meta.url),'utf8');
test('editor blocks oversized memory before sending a save request',()=>{
 assert.match(editor,/draftSizeOk=projectGuideFitsSize\(draft\)/);
 assert.match(editor,/if\(!guide\|\|saving\|\|!draftSizeOk\)return/);
 assert.match(editor,/disabled=\{saving\|\|!dirty\|\|draft\.trim\(\)\.length<20\|\|!draftSizeOk\}/);
 assert.match(validation,/new TextEncoder\(\)\.encode\(content\)\.length<=PROJECT_GUIDE_MAX_BYTES/);
});
