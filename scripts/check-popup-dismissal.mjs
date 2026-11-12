import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

// Exercise the real shared component, without a build or network requests.
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
try{
 const page=await browser.newPage();
 await page.route('**/*',route=>route.abort());
 await page.setContent('<button id="opener">Open</button><dialog id="sheet" style="width:300px;height:240px"><button class="commandments-handle">Drag</button><p>Selectable text</p></dialog><div id="popover" popover="auto" role="dialog">Menu</div><div id="preview" role="dialog" hidden>Preview</div>');
 await page.addScriptTag({content:fs.readFileSync('src/dialog-scroll.js','utf8')});
 await page.evaluate(()=>{
  window.sheet=document.querySelector('#sheet');window.opener=document.querySelector('#opener');window.closeCount=0;
  sheet.addEventListener('close',()=>{closeCount++;});
  opener.onclick=()=>BibleLensPopup.show(sheet,opener);
 });
 // Use the production draggable-handle handlers, not a test copy.
 const commandments=fs.readFileSync('src/commandments.js','utf8');
 const handle=commandments.slice(commandments.indexOf(" const handle=sheet.querySelector('.commandments-handle')"),commandments.indexOf(" root.addEventListener('click',event=>{",commandments.indexOf(" const handle=sheet.querySelector('.commandments-handle')")));
 assert(handle.includes('setPointerCapture'));
 await page.addScriptTag({content:'(()=>{const sheet=window.sheet,close=()=>sheet.close();'+handle+'})();'});
 const open=async()=>{await page.locator('#opener').click();assert(await page.locator('#sheet').evaluate(el=>el.open));};
 const isOpen=()=>page.locator('#sheet').evaluate(el=>el.open);
 await open();
 await page.evaluate(()=>{for(let i=0;i<5;i++)BibleLensPopup.prepare(sheet);});
 assert.equal(await page.locator('#sheet .ux-popup-close').count(),1,'Preparing repeatedly keeps one close control');
 await page.locator('#sheet p').click();assert(await isOpen(),'Inside clicks stay open');
 const box=await page.locator('#sheet').boundingBox();
 await page.mouse.move(box.x+100,box.y+100);await page.mouse.down();await page.mouse.move(2,2);await page.mouse.up();
 assert(await isOpen(),'Inside-start/outside-release stays open');
 await page.mouse.move(2,2);await page.mouse.down();await page.mouse.move(box.x+100,box.y+100);await page.mouse.up();
 assert(await isOpen(),'Outside-start/inside-release stays open');
 await page.locator('#sheet').dispatchEvent('pointerdown',{clientX:2,clientY:2});
 await page.locator('#sheet').dispatchEvent('pointercancel');
 await page.locator('#sheet').dispatchEvent('click',{clientX:2,clientY:2});
 assert(await isOpen(),'Cancelled gestures cannot dismiss');
 await page.mouse.click(2,2);await page.waitForFunction(()=>closeCount===1);
 assert(!(await isOpen()),'Backdrop click dismisses once');
 assert.equal(await page.evaluate(()=>document.activeElement.id),'opener','Opener focus restored');
 await open();await page.keyboard.press('Escape');await page.waitForFunction(()=>closeCount===2);
 assert(!(await isOpen()),'Escape preserves close hooks');
 await open();await page.locator('#sheet .ux-popup-close').click();await page.waitForFunction(()=>closeCount===3);
 await open();
 const grip=await page.locator('.commandments-handle').boundingBox();
 await page.mouse.move(grip.x+grip.width/2,grip.y+grip.height/2);await page.mouse.down();await page.mouse.move(grip.x+grip.width/2,grip.y+100);await page.mouse.up();
 await page.waitForFunction(()=>closeCount===4);assert(!(await isOpen()),'Commandment handle still dismisses by dragging');
 await open();
 await page.locator('#sheet').dispatchEvent('click',{clientX:2,clientY:2});
 assert(await isOpen(),'Reopening cannot reuse an earlier backdrop gesture');
 await page.keyboard.press('Escape');
 // Native auto-popovers retain browser light-dismiss; fallback dialogs above
 // have the same safe backdrop behavior without the Popover API.
 await page.evaluate(()=>document.querySelector('#popover').showPopover());
 await page.mouse.click(2,2);
 assert.equal(await page.locator('#popover').evaluate(el=>el.matches(':popover-open')),false);
 await page.evaluate(()=>document.querySelector('#popover').showPopover());await page.keyboard.press('Escape');
 assert.equal(await page.locator('#popover').evaluate(el=>el.matches(':popover-open')),false);
 await page.evaluate(()=>{window.previewClosed=0;const preview=document.querySelector('#preview');preview.addEventListener('uxpopupclose',()=>previewClosed++);preview.hidden=false;});
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>previewClosed),1,'Preview fallback close hook retained');
 // A late-loaded surface is enhanced even before the observer has scanned it.
 await page.evaluate(()=>{const late=document.createElement('dialog');late.id='late';document.body.append(late);late.showModal();});
 await page.mouse.click(2,2);assert.equal(await page.locator('#late').evaluate(el=>el.open),false);
 for(const file of ['navigation','commandments','prophecies'])assert(!fs.readFileSync(`src/${file}.js`,'utf8').includes('backdropStart'),`${file} uses the shared dismissal binding`);
 console.log('PASS: shared popup backdrop safety, cancellation, repeated binding/opening, close hooks, focus, Escape, draggable handle, native popover, preview fallback, and dynamic dialogs.');
}finally{await browser.close();}
