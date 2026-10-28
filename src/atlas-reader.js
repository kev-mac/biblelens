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
    help.textContent = 'Tap verse text or its number for actions. Tap a count for evidence.';
    readingBar.after(help);
  }

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
