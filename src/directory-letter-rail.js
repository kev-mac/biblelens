export const directoryInitial = name => String(name || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').charAt(0).toUpperCase();

// Both directories keep their existing search, filters and paginated results.
export function createDirectoryLetterRail(host, list, label, onJump) {
 const control = document.createElement('div'); control.className = 'directory-letter-control';
 const edge = document.createElement('button'); edge.type = 'button'; edge.className = 'directory-letter-edge';
 edge.setAttribute('aria-label', 'Hold the right edge to browse ' + label.toLowerCase() + ' by letter');
 edge.setAttribute('aria-expanded', 'false');
 const preview = document.createElement('div'); preview.className = 'directory-letter-preview'; preview.hidden = true; preview.setAttribute('aria-hidden', 'true');
 const rail = document.createElement('nav');
 rail.className = 'directory-letter-rail';
 rail.id = 'directory-letter-rail-' + label.toLowerCase(); rail.hidden = true; edge.setAttribute('aria-controls', rail.id);
 rail.setAttribute('aria-label', label + ' by first letter');
 control.append(edge, rail, preview);
 let active = '', frame = 0, pointer = null, lastDrag = '', opened = false, holdTimer = 0, keyboardOpen = false, startPoint;
 const buttons = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(letter => {
  const button = document.createElement('button');
  button.type = 'button'; button.textContent = letter; button.dataset.letter = letter;
  button.setAttribute('aria-label', 'Jump to ' + letter); button.disabled = true;
  button.onclick = () => { setActive(letter); onJump(letter); };
  rail.append(button); return button;
 });
 function setActive(letter) {
  active = letter;
  preview.textContent = letter; preview.hidden = !opened || !letter;
  const enabled = buttons.filter(button => !button.disabled);
  for (const button of buttons) {
   const selected = button.dataset.letter === active;
   button.setAttribute('aria-pressed', String(selected));
   button.tabIndex = button === (enabled.find(button => button.dataset.letter === active) || enabled[0]) ? 0 : -1;
  }
 }
 function measure() {
  frame = 0;
  if (host.hidden || !host.getClientRects().length) return;
  const controls = host.querySelectorAll('.stories-header,.characters-search-box,.filter-carousel');
  const top = Math.max(64, ...[...controls].map(node => node.getBoundingClientRect().bottom)) + 8;
  control.style.setProperty('--letter-rail-top', top + 'px');
  const jumpTop = Math.max(64, host.querySelector('.stories-header')?.getBoundingClientRect().bottom || 0) + 8;
  const pageOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  host.style.setProperty('--directory-letter-top', Math.max(0, jumpTop - pageOffset) + 'px');
  if (pointer !== null) return;
  const sections = [...list.querySelectorAll('[data-directory-letter],.ux-letter-heading[data-letter]')];
  const current = sections.filter(node => node.getBoundingClientRect().top <= top + 24).at(-1) || sections[0];
  if (current) setActive(current.dataset.directoryLetter || current.dataset.letter);
 }
 const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
 function reveal() {
  if (host.hidden) return;
  opened = true; rail.hidden = false; edge.setAttribute('aria-expanded', 'true');
  preview.hidden = !active; schedule();
 }
 function conceal() {
  clearTimeout(holdTimer); opened = false; keyboardOpen = false; pointer = null;
  rail.hidden = true; preview.hidden = true; edge.setAttribute('aria-expanded', 'false');
 }
 edge.onclick = event => {
  if (event.detail !== 0) return;
  if (opened) { conceal(); return; }
  keyboardOpen = true; reveal(); buttons.find(button => !button.disabled)?.focus({preventScroll:true});
 };
 rail.onkeydown = event => {
  const enabled = buttons.filter(button => !button.disabled);
  const index = enabled.indexOf(event.target);
  let next;
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = enabled[Math.min(index + 1, enabled.length - 1)];
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = enabled[Math.max(0, index - 1)];
  if (event.key === 'Home') next = enabled[0];
  if (event.key === 'End') next = enabled.at(-1);
  if (next) { event.preventDefault(); next.click(); next.focus({preventScroll:true}); }
 };
 function drag(event) {
  const button = buttons.find(button => {
   const rect = button.getBoundingClientRect();
   return !button.disabled && event.clientY >= rect.top && event.clientY < rect.bottom;
  });
  if (button && button.dataset.letter !== lastDrag) { lastDrag = button.dataset.letter; button.click(); }
 }
 function begin(event, fromEdge) {
  if (event.button !== 0) return;
  event.preventDefault(); pointer = event.pointerId; lastDrag = ''; keyboardOpen = false;
  startPoint = {clientX:event.clientX, clientY:event.clientY};
  event.currentTarget.setPointerCapture(pointer);
  if (fromEdge && !opened) holdTimer = setTimeout(() => { reveal(); drag(startPoint); }, 450);
  else { reveal(); drag(event); }
 }
 const move = event => {
  if (event.pointerId !== pointer) return;
  if (opened) drag(event);
  else if (Math.hypot(event.clientX-startPoint.clientX,event.clientY-startPoint.clientY)>10) clearTimeout(holdTimer);
 };
 const stop = () => { clearTimeout(holdTimer); pointer = null; lastDrag = ''; if (!keyboardOpen) conceal(); schedule(); };
 edge.onpointerdown = event => begin(event, true); rail.onpointerdown = event => begin(event, false);
 for (const node of [edge, rail]) { node.onpointermove = move; node.onpointerup = stop; node.onpointercancel = stop; node.onlostpointercapture = stop; node.oncontextmenu = event => event.preventDefault(); }
 document.addEventListener('keydown', event => { if (event.key === 'Escape' && opened) { conceal(); edge.focus({preventScroll:true}); } });
 document.addEventListener('pointerdown', event => { if (opened && !control.contains(event.target)) conceal(); }, true);
 document.addEventListener('scroll', schedule, {capture:true, passive:true});
 window.addEventListener('resize', schedule);
 window.addEventListener('viewchange', () => { conceal(); schedule(); });
 new ResizeObserver(schedule).observe(host);
 return {
  element: control,
  update(names) {
   const counts = new Map();
   for (const name of names) { const letter = directoryInitial(name); counts.set(letter, (counts.get(letter) || 0) + 1); }
   for (const button of buttons) {
    const total = counts.get(button.dataset.letter) || 0;
    button.disabled = total === 0;
    button.setAttribute('aria-label', 'Jump to ' + button.dataset.letter + ' · ' + total + ' ' + label.toLowerCase());
   }
   setActive(active); schedule();
  }
 };
}
