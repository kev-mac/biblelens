import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const drafts=process.env.BIBLELENS_DRAFTS==='1';
const output=process.env.ROLES_SHOTS||`${os.homedir()}/git/codex-reports/roles-shots`;
fs.mkdirSync(output,{recursive:true});
const people=await (await fetch(base+'/reference/people.json')).json();
assert.equal(people.length,3067);
assert.equal(people.some(person=>person.roles.some(tag=>tag.status==='draft')),drafts);
const groups={'All':()=>true,Women:p=>p.gender==='Female','Kings & Queens':p=>p.roles.some(t=>['king','queen'].includes(t.role)),Judges:p=>p.roles.some(t=>t.role==='judge'),...(drafts?{Prophets:p=>p.roles.some(t=>t.role==='prophet'),Priests:p=>p.roles.some(t=>t.role==='priest')} : {}),Apostles:p=>p.roles.some(t=>t.role==='apostle')};
const results=[];
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const [width,height] of [[375,812],[430,932]])for(const theme of ['dark','light']){
  const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/#people');await page.locator('#characters-list .ux-person-open').first().waitFor();
  await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
  assert.deepEqual(await page.locator('.directory-categories button').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label'))),Object.keys(groups));
  const shot=async name=>{await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${output}/${engine}-${width}-${theme}-${drafts?'draft':'production'}-${name}.png`});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);};
  for(const [name,filter] of Object.entries(groups)){
   const button=page.getByRole('button',{name,exact:true});await button.tap();
   assert.equal(await button.textContent(),`${name} (${people.filter(filter).length.toLocaleString()})`);
   assert.match(await page.locator('.characters-count').textContent(),new RegExp(`of ${people.filter(filter).length} people`));
   for(const card of await page.locator('#characters-list>.character-card').all()){
    const id=(await card.getAttribute('id')).replace('character-card-','');assert(filter(people.find(p=>p.id===id)));
   }
   await shot(name.toLowerCase().replaceAll(/[^a-z]+/g,'-'));
  }
  // From People: Kings & Queens, search field, David = three taps; typing adds no tap.
  await page.getByRole('button',{name:'Kings & Queens',exact:true}).tap();
  await page.locator('#characters-search').tap();await page.locator('#characters-search').fill('David');
  await page.locator('a[aria-label="Open David"]').tap();await page.locator('#character-sheet[open]').waitFor();
  assert.match(await page.locator('#character-sheet').innerText(),/David/);await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'All',exact:true}).tap();await page.locator('#characters-search').fill('Joash');
  await page.waitForFunction(()=>document.querySelector('#characters-list h2')?.textContent.startsWith('Joash'));
  const labels=await page.locator('#characters-list h2').allTextContents();assert(labels.includes('Joash (King of Judah)'));assert(labels.includes('Joash (King of Israel)'));
  // Capture both identified kings together without changing the application data.
  await page.getByRole('button',{name:'Kings & Queens',exact:true}).tap();await shot('joash-pair');
  assert.deepEqual(errors,[]);results.push({engine,width,theme,drafts,davidTaps:3,status:'PASS'});console.log('PASS',results.at(-1));await context.close();
 }}finally{await browser.close();}
}
fs.writeFileSync(`${output}/${drafts?'draft':'production'}-matrix.json`,JSON.stringify(results,null,2)+'\n');
