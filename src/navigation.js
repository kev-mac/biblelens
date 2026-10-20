'use strict';
// The header label opens a touch-friendly overview; compact header shortcuts remain available.
(() => {
 const triggers = [document.querySelector('#settings-navigation'), document.querySelector('header .brand')];
 const sheet = document.createElement('dialog');
 sheet.id = 'navigation-sheet'; sheet.className = 'navigation-sheet';
 sheet.setAttribute('aria-labelledby', 'navigation-heading');
 sheet.innerHTML = '<div class="navigation-heading"><h2 id="navigation-heading">Menu</h2><button type="button" data-navigation-close aria-label="Close navigation" autofocus>✕</button></div><div class="navigation-grid"></div>';
 document.body.append(sheet);
 for(const trigger of triggers){
 trigger.setAttribute('role', 'button');
 trigger.setAttribute('aria-haspopup', 'dialog');
 trigger.setAttribute('aria-controls', sheet.id);
 trigger.setAttribute('aria-expanded', 'false');
 }
 const grid = sheet.querySelector('.navigation-grid');
 const pages = [['explore','Read'],['chat','Chat'],['saved','Categories'],['bookmarks','Bookmarks'],['stories','Stories'],['characters','People'],['places','Places'],['commandments','Commandments'],['prophecies','Prophecies'],['timeline','Timeline']];
 for (const [page, label] of pages) {
  const button = document.createElement('button'); button.type = 'button'; button.dataset.navigationView = page;
  const icon = document.querySelector(`header nav [data-view="${page}"] svg`);
  if (icon) button.append(icon.cloneNode(true));
  else if(page==='places')button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
  else button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/></svg>';
  const text = document.createElement('span'); text.textContent = label; button.append(text); grid.append(button);
 }
 const settings = document.createElement('button'); settings.type = 'button'; settings.dataset.navigationSettings = '';
 settings.append(document.querySelector('#reader-picker svg').cloneNode(true));
 const settingsLabel = document.createElement('span'); settingsLabel.textContent = 'Settings'; settings.append(settingsLabel); grid.append(settings);
 function open() {
  if (sheet.open) return;
  for (const button of grid.querySelectorAll('[data-navigation-view]')) {
   if (button.dataset.navigationView === view) button.setAttribute('aria-current', 'page');
   else button.removeAttribute('aria-current');
  }
  document.querySelector('#reader-settings').close();sheet.showModal(); for(const trigger of triggers)trigger.setAttribute('aria-expanded', 'true'); document.body.classList.add('navigation-open');
 }
 for(const trigger of triggers){
 trigger.addEventListener('click', event => { event.preventDefault(); open(); });
 trigger.addEventListener('keydown', event => { if (event.key === ' ') { event.preventDefault(); open(); } });
 }
 sheet.querySelector('[data-navigation-close]').addEventListener('click', () => sheet.close());
 grid.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button) return;
  sheet.close();
  if (button.dataset.navigationView) { setView(button.dataset.navigationView); window.scrollTo({top:0,behavior:'smooth'}); }
  else if (button.hasAttribute('data-navigation-settings')) requestAnimationFrame(() => document.querySelector('#reader-picker').click());
 });
 sheet.addEventListener('close', () => { for(const trigger of triggers)trigger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('navigation-open');document.querySelector('#reader-picker').focus({preventScroll:true}); });
 const outside = event => { const r = sheet.getBoundingClientRect(); return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom; };
 let backdropStart = false;
 sheet.addEventListener('pointerdown', event => { backdropStart = event.target === sheet && outside(event); });
 sheet.addEventListener('click', event => { if (backdropStart && event.target === sheet && outside(event)) sheet.close(); backdropStart = false; });
 window.addEventListener('viewchange', () => { if (sheet.open) sheet.close(); });
})();

// Keep shortcuts in one row; Settings stays last.
(() => {
 const nav=document.querySelector('header nav');
 for(const page of ['explore','chat','saved','bookmarks','stories','characters','commandments','prophecies'])nav.append(nav.querySelector(`[data-view="${page}"]`));
 nav.append(document.querySelector('#reader-picker'));
 let lastY=window.scrollY;
 function update(){
  if(document.body.classList.contains('dialog-scroll-locked'))return;
  const y=Math.max(0,window.scrollY),delta=y-lastY;
  document.body.classList.toggle('reader-scrolled',y>=20);
  if(y<20)document.body.classList.remove('navigation-enlarged');
  else if(Math.abs(delta)>=4)document.body.classList.toggle('navigation-enlarged',delta<0);
  lastY=y;
 }
 window.addEventListener('scroll',update,{passive:true});
 window.addEventListener('viewchange',()=>{document.body.classList.remove('navigation-enlarged');lastY=window.scrollY;});
 document.querySelector('#nav-colors').addEventListener('click',()=>{
  readerPreferences.navColors=state.readerPreferences?.navColors==='off'?'on':'off';state.readerPreferences=readerPreferences;
  applyNavigationAppearance();persist();
 });
 applyNavigationAppearance();
})();
function applyNavigationAppearance(){
 const on=state.readerPreferences?.navColors!=='off';
 document.body.classList.toggle('navigation-colored',on);
 document.querySelector('#nav-colors').setAttribute('aria-checked',String(on));
 document.querySelector('#nav-colors-state').textContent=on?'On':'Off';
}
