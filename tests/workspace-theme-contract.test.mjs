import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const theme=readFileSync(new URL('../src/lib/use-workspace-theme.ts',import.meta.url),'utf8');
test('workspace theme persists and synchronizes across browser tabs',()=>{
 assert.match(theme,/localStorage\.getItem\(WORKSPACE_THEME_STORAGE_KEY\)/);
 assert.match(theme,/localStorage\.setItem\(WORKSPACE_THEME_STORAGE_KEY/);
 assert.match(theme,/addEventListener\('storage',onStorage\)/);
 assert.match(theme,/removeEventListener\('storage',onStorage\)/);
 assert.match(theme,/event\.newValue==='dark'/);
});
