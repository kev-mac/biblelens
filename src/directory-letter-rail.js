export const directoryInitial = name => String(name || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').charAt(0).toUpperCase();

// Both directories keep their existing search, filters and paginated results.
export function createDirectoryLetterRail(host, list, label, onJump) {
 const rail = document.createElement('nav');
 rail.className = 'directory-letter-rail';
 rail.setAttribute('aria-label', label + ' by first letter');
 let active = '', frame = 0, pointer = null, lastDrag = '';
 const buttons = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(letter => {
  const button = document.createElement('button');
  button.type = 'button'; button.textContent = letter; button.dataset.letter = letter;
  button.setAttribute('aria-label', 'Jump to ' + letter); button.disabled = true;
  button.onclick = () => { setActive(letter); onJump(letter); };
  rail.append(button); return button;
 });
 function setActive(letter) {
  active = letter;
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
  rail.style.setProperty('--letter-rail-top', top + 'px');
  host.style.setProperty('--directory-letter-top', top + 'px');
  if (pointer !== null) return;
  const sections = [...list.querySelectorAll('[data-directory-letter],.ux-letter-heading[data-letter]')];
  const current = sections.filter(node => node.getBoundingClientRect().top <= top + 16).at(-1) || sections[0];
  if (current) setActive(current.dataset.directoryLetter || current.dataset.letter);
 }
 const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
 rail.onkeydown = event => {
  const enabled = buttons.filter(button => !button.disabled);
  const index = enabled.indexOf(event.target);
  let next;
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = enabled[Math.min(index + 1, enabled.length - 1)];
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = enabled[Math.max(0, index - 1)];
  if (event.key === 'Home') next = enabled[0];
  if (event.key === 'End') next = enabled.at(-1);
  if (next) { event.preventDefault(); next.focus({preventScroll:true}); next.click(); }
 };
 function drag(event) {
  const button = buttons.find(button => {
   const rect = button.getBoundingClientRect();
   return !button.disabled && event.clientY >= rect.top && event.clientY < rect.bottom;
  });
  if (button && button.dataset.letter !== lastDrag) { lastDrag = button.dataset.letter; button.click(); }
 }
 rail.onpointerdown = event => {
  if (event.pointerType === 'mouse' || event.button !== 0) return;
  event.preventDefault(); pointer = event.pointerId; lastDrag = '';
  rail.setPointerCapture(pointer); drag(event);
 };
 rail.onpointermove = event => { if (event.pointerId === pointer) drag(event); };
 const stop = () => { pointer = null; lastDrag = ''; schedule(); };
 rail.onpointerup = stop; rail.onpointercancel = stop; rail.onlostpointercapture = stop;
 document.addEventListener('scroll', schedule, {capture:true, passive:true});
 window.addEventListener('resize', schedule);
 window.addEventListener('viewchange', schedule);
 new ResizeObserver(schedule).observe(host);
 return {
  element: rail,
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
