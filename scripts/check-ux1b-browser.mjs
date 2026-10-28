import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium, webkit} from 'playwright';

// Exercise actual touch controls. Scripted navigation is only used to start a
// fresh task at home, never to reach a task or return from it.
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const output='.review/ux1',results=[];
fs.mkdirSync(output,{recursive:true});
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch({headless:true});
 try{for(const [width,height] of [[390,844],[430,932]])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,colorScheme:theme,reducedMotion:'reduce'});
  const response=await context.request.get(base+'/release.json');assert(response.ok());
  const identity=await response.json();assert(!identity.draftOnly,'Production build required');
  assert.equal(identity.buildNumber,JSON.parse(fs.readFileSync('package.json')).buildNumber);
  const page=await context.newPage(),errors=[],row={engine,width,height,theme,tasks:{}};
  page.on('pageerror',error=>errors.push(error.message));
  const shot=async name=>{
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:`${output}/ux1b-${engine}-${width}-${theme}-${name}.png`});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,'No page overflow');
  };
  const home=async()=>{
   await page.goto(base);
   await page.waitForSelector('.ux-topic-row');
   await page.waitForFunction(()=>!document.documentElement.classList.contains('bl-starting'));
   await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
  };
  let taps=0;
  const tap=async locator=>{await locator.tap();taps++;};
  const finish=async(task,back)=>{
   const outward=taps;assert(outward<=3,task+' opens in at most three taps');
   await shot(task);taps=0;await back();
   await page.waitForSelector('.ux-topic-row');
   assert(taps<=3,task+' returns home in at most three taps');
   row.tasks[task]={open:outward,home:taps};await shot(task+'-home');
  };
  await home();await shot('home');taps=0;
  await tap(page.locator('[data-topic="people"]'));
  await page.waitForSelector('.ux-person-open');await shot('people');
  await tap(page.getByRole('button',{name:'M',exact:true}));
  assert.equal(await page.getByRole('button',{name:'M',exact:true}).getAttribute('aria-pressed'),'true');
  await shot('people-m');
  // Scrolling a list is not a tap; no search, typing or hidden control is used.
  await tap(page.getByRole('link',{name:'Open Moses',exact:true}));
  await page.waitForSelector('#character-sheet[open]');
  assert.match(await page.locator('#character-sheet').innerText(),/Moses/);
  await finish('moses',async()=>{
   await tap(page.locator('#character-sheet .ux-dialog-path button'));
   await tap(page.locator('.lens-primary a[data-lens-view="explore"]'));
  });
  await home();taps=0;
  await tap(page.locator('.lens-primary a[data-lens-view="read"]'));
  await page.waitForSelector('#verse-1 [data-scripture]');
  assert((await page.locator('#verse-1 [data-scripture]').innerText()).length>15);
  await finish('passage',()=>tap(page.locator('.lens-primary a[data-lens-view="explore"]')));
  await home();taps=0;
  await tap(page.locator('.lens-primary a[data-lens-view="debates"]'));
  await page.waitForSelector('.accepted-questions a');await shot('questions');
  await tap(page.locator('.accepted-questions a').first());
  await page.waitForSelector('[data-accepted-save]');
  assert((await page.locator('#debate-view h1').innerText()).length>10);
  await finish('question',()=>tap(page.locator('.lens-primary a[data-lens-view="explore"]')));
  assert.deepEqual(errors,[]);results.push(row);
  fs.writeFileSync(`${output}/ux1b-taps.json`,JSON.stringify(results,null,2)+'\n');
  console.log('PASS '+JSON.stringify(row));await context.close();
 }}finally{await browser.close();}
}
