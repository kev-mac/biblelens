import {framingAudit} from './check-neutral-framing.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('src/app.js','utf8');
const scope=vm.createContext({URLSearchParams,URL});
vm.runInContext(source.slice(source.indexOf('function canonicalRouteHash('),source.indexOf('function navigateHash(')),scope);
for(const [old,expected] of [
 ['#discover','#discover'],['#discover?tab=places','#discover?tab=places'],
 ['#explore','#read'],['#bookmarks','#notebook?section=bookmarks'],['#debates','#questions'],['#questions','#questions'],['#debates?mode=science','#questions?mode=science'],['#debates?draft=1&selection=saved&mode=text-vs-text','#questions?draft=1&selection=saved&mode=text-vs-text'],['#debate/legacy-science-1','#debate/legacy-science-1'],['#explore/0/1','#read/0/1'],['#explore/8/17/4-7','#read/8/17/4-7'],
 ['#categories','#discover?section=evidence'],['#saved','#discover?section=evidence'],
 ['#categories/academic?book=8&chapter=17','#questions?mode=history'],
 ['#saved/T?book=all','#questions?filter=T'],['#read/8/17/4','#read/8/17/4'],
 ['#people/adam','#people/adam'],['#notebook?note=verse%3A0%3A1%3A1','#notebook?note=verse%3A0%3A1%3A1'],
 ['#compare?left=Genesis+1&right=Genesis+2','#compare?left=Genesis+1&right=Genesis+2']
]){
 assert.equal(scope.canonicalRouteHash(old),expected,old);
 assert.equal(scope.canonicalRouteHash(expected),expected,'Canonical routes are stable');
}
assert.match(source,/history\.replaceState\(history\.state,'',canonical\)/,'Redirects preserve history metadata');
assert.match(source,/if\(navigationRestore\)navigationRestore\.hash=canonical/,'Back navigation retains its restoration destination');
console.log('PASS: route aliases preserve reader paths, category filters, bookmarks, query strings and history metadata.');

const framing=framingAudit();assert.deepEqual(framing.violations,[],'Banned user-facing framing');assert.deepEqual(framing.renames,[],'Old user-facing labels');
console.log('PASS: neutral framing and display vocabulary in current copy and effective drafts.');
