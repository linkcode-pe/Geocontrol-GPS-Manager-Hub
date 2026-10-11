import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../src/lib/pagination.ts',import.meta.url),'utf8');
const body=src.replace('rawPage: string | null, rawLimit: string | null','rawPage, rawLimit').replace('export function','function');
const taskPagination=Function(`${body};return taskPagination`)();
test('default page and bounded limit',()=>assert.deepEqual(taskPagination(null,null),{page:1,limit:100,offset:0}));
test('pagination offset',()=>assert.deepEqual(taskPagination('3','200'),{page:3,limit:200,offset:400}));
for(const [p,l] of [['0','100'],['-1','100'],['abc','100'],['1','201'],['1','0'],['1','1.5'],['9007199254740992','100']])test(`reject ${p}/${l}`,()=>assert.equal(taskPagination(p,l),null));
