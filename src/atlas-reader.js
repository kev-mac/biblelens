'use strict';

// Presentation hooks for the reading room. The existing reader continues to
// own passages, selection, evidence, notes and all navigation behavior.
(() => {
  const chapter = document.getElementById('chapter-text');
  const inspector = document.getElementById('lensInspector');
  if (!chapter || !inspector) return;

  const readingBar = document.getElementById('lensReadingBar');
  if (readingBar && !document.getElementById('atlas-reader-help')) {
    const help = document.createElement('p');
    help.id = 'atlas-reader-help';
    help.className = 'atlas-reader-help';
    help.textContent = 'Tap a verse to explore its context and linked passages.';
    readingBar.after(help);
  }

  const controls=document.createElement('div');controls.className='ux-reader-controls';
  const svg=path=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="${path}"/></svg>`;
  controls.innerHTML=`<button type="button" id="ux-chapter-picker" aria-label="Choose chapter"></button><button type="button" id="ux-font-less" aria-label="Decrease text size">A−</button><button type="button" id="ux-font-more" aria-label="Increase text size">A+</button><button type="button" id="ux-font-style" aria-label="Use serif app font">${svg('M4 20 12 4l8 16M7 14h10')}</button><button type="button" id="ux-prev" aria-label="Previous chapter">${svg('m15 5-7 7 7 7')}</button><button type="button" id="ux-next" aria-label="Next chapter">${svg('m9 5 7 7-7 7')}</button>`;
  readingBar.prepend(controls);
  const typePanel=document.createElement('div');typePanel.className='ux-type-panel';typePanel.hidden=true;
  typePanel.append(document.getElementById('ux-font-less'),document.getElementById('ux-font-more'),document.getElementById('ux-font-style'));readingBar.after(typePanel);
  const aa=document.createElement('button');aa.type='button';aa.textContent='Aa';aa.setAttribute('aria-label','Text size');aa.setAttribute('aria-expanded','false');aa.onclick=()=>{typePanel.hidden=!typePanel.hidden;aa.setAttribute('aria-expanded',String(!typePanel.hidden));};
  controls.append(aa);
  controls.querySelector('#ux-chapter-picker').after(document.querySelector('.lens-edition-label'));
  readingBar.append(document.getElementById('lens-focus'));
  document.querySelector('.chapter-bottom').append(document.getElementById('lens-compare'));
  document.querySelector('.lens-reading-actions').hidden=true;
  const control=id=>document.getElementById(id);
  control('ux-chapter-picker').onclick=()=>chapter.querySelector('.passage-heading-picker')?.click();
  for(const [id,step] of [['ux-font-less',-5],['ux-font-more',5]])control(id).onclick=()=>{const slider=control('reader-font');slider.value=String(Math.max(85,Math.min(150,Number(slider.value)+step)));slider.dispatchEvent(new Event('input'));slider.dispatchEvent(new Event('change'));};
  control('ux-font-style').onclick=()=>{const select=control('app-font-family');select.value=['lora','georgia'].includes(readerPreferences.appFont)?'inter':'lora';select.dispatchEvent(new Event('change'));updateControls();};
  control('ux-prev').onclick=()=>control('prev-bottom').click();control('ux-next').onclick=()=>control('next-bottom').click();
  function updateControls(){
   if(!reading)return;
   const bookLabel=document.createElement('span');bookLabel.className='ux-picker-book';bookLabel.textContent=reading.name;
   const chapterLabel=document.createElement('span');chapterLabel.className='ux-picker-chapter';chapterLabel.textContent=' '+reading.chapter+' ▾';
   control('ux-chapter-picker').replaceChildren(bookLabel,chapterLabel);
   control('ux-chapter-picker').setAttribute('aria-label',reading.name+' '+reading.chapter+'. Choose chapter');
   control('ux-prev').disabled=readingBook===0&&readingChapter===1;
   control('ux-next').disabled=readingBook===books.length-1&&readingChapter===books[readingBook].chapters;
   control('ux-font-style').setAttribute('aria-label',['lora','georgia'].includes(readerPreferences.appFont)?'Use sans serif app font':'Use serif app font');
   control('ux-font-less').disabled=Number(state.textScale)<=.85;control('ux-font-more').disabled=Number(state.textScale)>=1.5;
  }
  window.addEventListener('biblelens:statechange',updateControls);
  function decorateHeading() {
    if (typeof reading === 'undefined' || !reading) return;
    const heading = chapter.querySelector('.passage-heading');
    const picker = heading?.querySelector('.passage-heading-picker');
    if (!picker || picker.querySelector('.atlas-book-title')) return;

    const book = document.createElement('span');
    book.className = 'atlas-book-title';
    book.textContent = reading.name + ' ';
    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevron.classList.add('atlas-passage-chevron');
    chevron.setAttribute('viewBox', '0 0 16 16');
    chevron.setAttribute('aria-hidden', 'true');
    chevron.setAttribute('focusable', 'false');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'm4 6 4 4 4-4');
    chevron.append(path);
    book.append(chevron);
    const mark = document.createElement('span');
    mark.className = 'atlas-chapter-mark';
    const label = document.createElement('span');
    label.className = 'atlas-chapter-label';
    label.textContent = 'Chapter ';
    const number = document.createElement('span');
    number.className = 'atlas-chapter-number';
    number.textContent = String(reading.chapter);
    mark.append(label, number);
    picker.replaceChildren(book, mark);
    picker.setAttribute('aria-label', `${reading.name} Chapter ${reading.chapter}. Choose book, chapter and verse`);

    const collection = document.createElement('p');
    collection.className = 'atlas-reader-collection';
    collection.textContent = readingBook < 39 ? 'Old Testament' : 'New Testament';
    picker.closest('h1').before(collection);
    heading.classList.add('atlas-passage-heading');
  }

  function connectMargin() {
    const active = chapter.querySelector('.verse.lens-active-verse');
    inspector.classList.toggle('atlas-verse-margin', !!active);
    // The count remains a real evidence control. Both ends of the connection
    // use the same copper cue without changing scripture or category meaning.
    for (const marker of chapter.querySelectorAll('[data-lens-inspect]')) {
      marker.classList.add('atlas-evidence-marker');
      marker.setAttribute('aria-controls', 'lensInspector');
    }
  }

  function refresh() {
    updateControls();
    decorateHeading();
    connectMargin();
  }

  window.addEventListener('biblelens:readerchange', refresh);
  window.addEventListener('biblelens:readerloading', () => inspector.classList.remove('atlas-verse-margin'));
  // Selecting a marker updates the existing inspector without rendering a new
  // chapter. Observe its content only; our own classes cannot retrigger it.
  new MutationObserver(connectMargin).observe(inspector, {childList: true});
  refresh();
})();
