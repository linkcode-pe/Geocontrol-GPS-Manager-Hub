import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseActivityFilters} from '../src/lib/activity-filters.mjs';
const parse=q=>parseActivityFilters(new URLSearchParams(q));
test('activity filters default safely',()=>assert.deepEqual(parse(''),{page:1,where:'',values:[]}));
test('activity filters combine action and date range',()=>assert.deepEqual(parse('page=2&action=delete&from=2026-10-01&to=2026-10-11'),{page:2,where:' WHERE a.action=? AND a.created_at>=? AND a.created_at<?',values:['delete','2026-10-01 00:00:00','2026-10-12 00:00:00']}));
test('activity filters reject invalid inputs',()=>{for(const q of ['page=0','page=10001','action=anything','from=2026-02-30','to=2026-13-01','from=2026-10-12&to=2026-10-11'])assert.equal(parse(q),null,q);});
