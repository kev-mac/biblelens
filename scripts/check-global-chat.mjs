import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('src/reader.js','utf8'),c={books:[{id:1,name:'Exodus'}],esc:s=>String(s).replaceAll('<','&lt;'),chatMessages:[{role:'assistant',content:'Flies [source ID 1].',details:'Exodus 8 [1].',sources:[{id:1,label:'Exodus 8',url:'#read/1/8',kind:'Scripture'}]}],$:()=>c.node};c.chatBusy=false;c.conversationTone='168,85,247';c.fitChatCitations=()=>{};c.comparisonEvidenceOpen=new Set();vm.createContext(c);vm.runInContext(source.slice(source.indexOf('const BOOK_CITATION_ABBREVIATIONS'),source.indexOf('function comparisonTone')),c);c.node={style:{setProperty(){}}};vm.runInContext(source.slice(source.indexOf('function sourceHtml'),source.indexOf("$('#chat-form').onsubmit")),c);c.chatMessages.unshift({role:'user',content:'Old question'},{role:'assistant',content:'Old answer'});c.renderChat();assert.match(c.node.innerHTML,/Old question/);assert.match(c.node.innerHTML,/Old answer/);assert.match(source,/selected:selection,history/);assert.doesNotMatch(source,/id="reader-question"/);assert.match(source,/selection=\[\]/);assert.match(fs.readFileSync("src/index.html","utf8"),/id="chat-input" type="text" autocomplete="off"/);assert.match(c.node.innerHTML,/Flies \./);assert.match(c.node.innerHTML,/<details class="comparison-details chat-details" hidden>/);assert.doesNotMatch(c.node.innerHTML,/<details[^>]* open/);assert.match(c.node.innerHTML,/class="verse-citation chat-citation"/);assert.doesNotMatch(c.sourceHtml({url:'javascript:alert(1)'}),/javascript/);
console.log('PASS: global retrieval across chapters, plague sequence, named references, no reading prerequisite, separate summary/details and safe citation chips.');

// Run the production formatter against hostile text and mixed references.
c.esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
c.books=[{id:0,name:'Genesis',chapters:50},{id:1,name:'Exodus',chapters:40},{id:45,name:'1 Corinthians',chapters:16}];
const hostile='<img src=x onerror="alert(1)"> Genesis 5:28-29 and Exodus 8:2,4,7-9; 1 Corinthians 13:4. Genesis 51:1.';
const linked=c.chatTextHtml(hostile);
assert(linked.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'));
assert(!linked.includes('<img'));
assert(linked.includes('href="#read/0/5/28-29"'));
assert(linked.includes('href="#read/1/8/2,4,7-9"'));
assert(linked.includes('href="#read/45/13/4"'));
assert(!linked.includes('href="#read/0/51'));
assert.equal(c.chatSummary('I found a related passage, Genesis 5:29.'),'Genesis 5:29.');
assert.equal(c.parseVerseSpec('0'),null);assert.equal(c.parseVerseSpec('200'),null);assert.equal(c.parseVerseSpec('9-2'),null);
assert.deepEqual(Array.from(c.parseVerseSpec('2,4,7-9')),[2,4,7,8,9]);
c.chatMessages=[{role:'user',content:'Exodus 8:2 <script>bad()</script>'},{role:'assistant',content:hostile,details:'Exodus 8:3 <svg onload="bad()">',sources:[]}];
c.renderChat();
const [userArticle,assistantArticle]=c.node.innerHTML.split('</article>');
assert(!userArticle.includes('<a '));assert(userArticle.includes('&lt;script&gt;'));
assert(assistantArticle.includes('href="#read/1/8/3"'));assert(!assistantArticle.includes('<svg onload'));
const routeCalls=[];c.location={hash:'#read/1/8/2,4,7-9'};c.window={addEventListener(){}};c.setView=()=>{};c.loadChapter=(...args)=>routeCalls.push(args);
vm.runInContext(source.slice(source.indexOf('function readerRoute('),source.indexOf('async function initializeReader(')),c);
c.readerInitialization=null;c.readerRoute();assert.deepEqual(routeCalls[0],[1,8,2,false]);
c.readerInitialization=Promise.resolve();c.readerRoute();assert.equal(routeCalls.length,1,'Pending initialization owns the first chapter request');c.readerInitialization=null;
c.location.hash='#read/1/8/200';c.readerRoute();assert.equal(routeCalls.length,1);
console.log('PASS: assistant references are actual escaped hyperlinks, user text stays plain, and bounded range/list routes focus the first verse.');

// All source types are reachable from compact summary chips, without a repeated source list.
c.chatMessages=[{role:'assistant',content:'An answer without a literal reference.',details:'Exodus 8:3: “The excerpt.”\n\nInterpretation needs its historical context.',sources:[{label:'Exodus 8:3',url:'#read/1/8/3',kind:'Primary scripture'},{label:'Duplicate',url:'#read/1/8/3'}]}];
c.renderChat();assert.equal((c.node.innerHTML.match(/href="#read\/1\/8\/3"/g)||[]).length,1);assert(c.node.innerHTML.includes('chat-summary-sources'));assert(!c.node.innerHTML.includes('The excerpt.'));assert(c.node.innerHTML.includes('Interpretation needs its historical context.'));
console.log('PASS: unique source chips appear with the answer; repeated excerpts are omitted while context and limits remain.');

assert(linked.includes('class="verse-link"'));assert(!linked.includes('class="verse-citation'));assert(c.sourceLinkHtml({url:'#read/1/8/3'}).includes('>Exo 8:3</a>'));

assert(c.chatTextHtml('Exodus 8:3: “Quoted text”').includes('href="#read/1/8/3"'));
