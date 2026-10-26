import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('src/app.js','utf8');
const scope=vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function canonicalRouteHash('),source.indexOf('function navigateHash(')),scope);
for(const [old,expected] of [
 ['#discover','#explore'],['#discover?tab=places','#explore?tab=places'],
 ['#explore','#explore'],['#explore/0/1','#read/0/1'],['#explore/8/17/4-7','#read/8/17/4-7'],
 ['#categories','#evidence'],['#saved','#evidence'],
 ['#categories/academic?book=8&chapter=17','#evidence/academic?book=8&chapter=17'],
 ['#saved/T?book=all','#evidence/T?book=all'],['#read/8/17/4','#read/8/17/4'],
 ['#people/adam','#people/adam'],['#notebook?note=verse%3A0%3A1%3A1','#notebook?note=verse%3A0%3A1%3A1'],
 ['#compare?left=Genesis+1&right=Genesis+2','#compare?left=Genesis+1&right=Genesis+2']
]){
 assert.equal(scope.canonicalRouteHash(old),expected,old);
 assert.equal(scope.canonicalRouteHash(expected),expected,'Canonical routes are stable');
}
assert.match(source,/history\.replaceState\(history\.state,'',canonical\)/,'Redirects preserve history metadata');
assert.match(source,/if\(navigationRestore\)navigationRestore\.hash=canonical/,'Back navigation retains its restoration destination');
console.log('PASS: route aliases preserve reader paths, category filters, bookmarks, query strings and history metadata.');
