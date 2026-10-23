import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const validation=readFileSync(new URL('../src/lib/project-guide-validation.ts',import.meta.url),'utf8');
const api=readFileSync(new URL('../src/app/api/project-guide/route.ts',import.meta.url),'utf8');
test('project memory accepts existing 190k content while keeping explicit size guards',()=>{
 assert.match(validation,/PROJECT_GUIDE_MAX_CHARACTERS=500_000/);
 assert.match(validation,/PROJECT_GUIDE_MAX_BYTES=1_000_000/);
 assert.match(validation,/Buffer\.byteLength\(content,'utf8'\)/);
 assert.match(api,/!validProjectGuideContent\(body\?\.content\)/);
 assert.doesNotMatch(api,/body\.content\.length>100000/);
});
