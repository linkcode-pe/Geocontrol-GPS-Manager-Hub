import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('restore only rewrites database directives and validates temporary schema',()=>{
 const safety=readFileSync(new URL('../scripts/restore-dump-safety.py',import.meta.url),'utf8');
 const restore=readFileSync(new URL('../scripts/verify-restore-hub.py',import.meta.url),'utf8');
 assert.match(safety,/hub_restore_check_\[0-9a-f\]\{12\}/);
 assert.match(safety,/create\.sub\(/);
 assert.match(safety,/use\.sub\(/);
 assert.doesNotMatch(safety,/source\.replace\(b'geocontrol_hub'/);
 assert.match(restore,/safety\.isolated_dump\(source,target\)/);
 assert.match(restore,/if created:/);
});
