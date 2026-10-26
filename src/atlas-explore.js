'use strict';
// Study Atlas is a presentation layer. Existing routes, person IDs and the
// shared data-place-id handler continue to open the real research records.
(() => {
  const host = document.getElementById('discover-view');
  if (!host || host.dataset.studyAtlas === 'ready') return;
  const starterStudies = host.querySelector('.lens-starter-studies');
  // Keep these cards available for future work without presenting them in Explore.
  const deferredCollections = new Set(['prophecies', 'method']);
  const collections = [
    {route:'places', image:'places', title:'Places', kicker:'Geography', heading:'Geography and Historical Setting.', copy:'Examine place references, proposed identifications and the geography of biblical texts.', action:'Explore places', alt:'An illustrated ancient hilltop city, winding paths and distant mountains in warm light.', related:'Start in <button type="button" data-place-id="recL1WV82pXaRBQ59" aria-haspopup="dialog" aria-controls="atlas-sheet" aria-label="Explore Jerusalem in the atlas">Jerusalem</button>, <button type="button" data-place-id="recmRfnw4XzPBH9jc" aria-haspopup="dialog" aria-controls="atlas-sheet" aria-label="Explore Nazareth in the atlas">Nazareth</button> or <button type="button" data-place-id="rectrAkGtrZH5LMp8" aria-haspopup="dialog" aria-controls="atlas-sheet" aria-label="Explore Beersheba in the atlas">Beersheba</button>.'},
    {route:'people', image:'people', title:'People', kicker:'People & connections', heading:'People and Relationships.', copy:'Examine named figures, genealogies and relationships described in the texts.', action:'Explore people', alt:'An imagined ancient Near Eastern family: an older man and woman with a young listener.', related:'Begin with <a href="#characters/reccdFYIq50NyxNej">Abraham</a>, <a href="#characters/rechda7WMDuW1jBTq">Sarah</a> and <a href="#characters/recqIoG1fkaNWJ1y0">Isaac</a> in <a href="#read/0/21/3">Genesis 21:3</a>.'},
    {route:'stories', image:'stories', title:'Stories', kicker:'Narratives', heading:'Narratives in Context.', copy:'Analyze plot, literary structure and recurring themes across biblical narratives.', action:'Explore stories', alt:'An illustrated journey across a sweeping ancient landscape.'},
    {route:'categories', image:'evidence', title:'Evidence', kicker:'Text & interpretation', heading:'Text, Context and Evidence.', copy:'Compare textual claims, interpretations and attributed historical or linguistic evidence.', action:'Examine the evidence', alt:'Illustrated hands examining the parchment layers of an old manuscript in warm window light.'},
    {route:'timeline', image:'timeline', title:'Timeline', kicker:'Chronology', heading:'Chronology and Dating.', copy:'Compare narrative sequences and proposed dates, with disputed chronologies identified.', action:'Explore the timeline', alt:'An illustrated landscape of ancient architecture and civilizations across successive eras.'},
    {route:'commandments', image:'commandments', title:'Commandments', kicker:'Law & daily life', heading:'Law in Historical Context.', copy:'Examine the 613 traditionally enumerated commandments by subject and textual reference.', action:'Explore commandments', alt:'An imagined desert mountain pass with two weathered stone tablets on a ledge.'},
    {route:'prophecies', image:'prophecies', title:'Prophecies', kicker:'Words & interpretation', heading:'Prophecy and Interpretation.', copy:'Examine prophetic texts, later interpretations and proposed correspondences.', action:'Explore prophecies', alt:'An illustrated ancient observer looking toward a distant city under a dramatic sky.', note:'3 illustrative records · review pending.'},
    {route:'method', image:'method', title:'Method & Sources', kicker:'How BibleLens works', heading:'Sources and Research Methods.', copy:'Review source attribution, editorial decisions and gaps in coverage.', action:'Read our method', alt:'An imagined archaeological worktable with a repaired clay vessel, fragments and a reference notebook.'}
  ].filter(item => !deferredCollections.has(item.route));
  const arrow = direction => `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="${direction === 'previous' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  host.dataset.studyAtlas = 'ready';
  host.classList.add('atlas-explore');
  host.innerHTML = `
    <div class="atlas-explore-heading"><div><span class="atlas-explore-eyebrow">The study atlas</span><h1 tabindex="-1">Follow the Thread.</h1></div><p>Explore connections among texts, people,<br> places and historical settings.</p></div>
    <div class="atlas-explore-tabs" role="tablist" aria-label="Explore collections" aria-orientation="horizontal">${collections.map((item, index) => `<button type="button" role="tab" id="atlas-explore-tab-${item.route}" class="atlas-explore-tab" aria-selected="${index === 0}" aria-controls="atlas-explore-panel-${item.route}" tabindex="${index === 0 ? '0' : '-1'}">${item.title}</button>`).join('')}</div>
    <div class="atlas-explore-gallery" aria-label="Illustrated collections">${collections.map((item, index) => `
      <section class="atlas-explore-panel" id="atlas-explore-panel-${item.route}" role="tabpanel" aria-labelledby="atlas-explore-tab-${item.route}" data-active="${index === 0}"${index === 0 ? '' : ' aria-hidden="true" inert'}>
        <div class="atlas-explore-feature atlas-explore-feature-${item.route}">
          <div class="atlas-explore-visual" data-image-state="loading" aria-busy="true"><img class="atlas-explore-image" src="/assets/explore-${item.image}.webp" alt="${item.alt}" width="1200" height="800" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"${index === 0 ? ' fetchpriority="high"' : ''}><div class="atlas-image-status" role="status"><span class="loading-state">Loading image…</span><button type="button" aria-label="Retry ${item.title} image" hidden>Retry</button></div></div>
          <div class="atlas-explore-copy"><span class="atlas-explore-eyebrow">${item.kicker}</span><h2>${item.heading}</h2><p>${item.copy}</p><a class="atlas-explore-action" href="#${item.route}">${item.action}<span aria-hidden="true">↗</span></a>${item.related ? `<p class="atlas-explore-related">${item.related}</p>` : ''}${item.note ? `<small class="atlas-explore-source">${item.note}</small>` : ''}</div>
        </div>
      </section>`).join('')}</div>
    <div class="atlas-explore-gallery-footer"><button type="button" class="atlas-explore-step" data-atlas-step="-1" aria-label="Previous collection" disabled>${arrow('previous')}</button><p class="atlas-explore-position" aria-live="polite" aria-atomic="true"><span class="atlas-explore-position-label">Places</span></p><button type="button" class="atlas-explore-step" data-atlas-step="1" aria-label="Next collection: People">${arrow('next')}</button></div>
    <div class="atlas-explore-studies"></div>`;

  // Keep the illustration's space reserved while its actual request finishes.
  for (const visual of host.querySelectorAll('.atlas-explore-visual')) {
    const image = visual.querySelector('img');
    const status = visual.querySelector('.atlas-image-status');
    const message = status.querySelector('span');
    const retry = status.querySelector('button');
    function imageState(state) {
      visual.dataset.imageState = state;
      visual.setAttribute('aria-busy', String(state === 'loading'));
      status.hidden = state === 'ready';
      message.classList.toggle('loading-state', state === 'loading');
      message.textContent = state === 'error' ? 'Image unavailable.' : 'Loading image…';
      retry.hidden = state !== 'error';
    }
    image.addEventListener('load', () => imageState('ready'));
    image.addEventListener('error', () => imageState('error'));
    retry.addEventListener('click', () => {
      imageState('loading');
      image.src = image.src;
    });
    if (image.complete) imageState(image.naturalWidth ? 'ready' : 'error');
  }

  // Preserve the original questions and their actual study IDs.
  if (starterStudies) host.querySelector('.atlas-explore-studies').append(starterStudies);
  const gallery = host.querySelector('.atlas-explore-gallery');
  const tablist = host.querySelector('.atlas-explore-tabs');
  const tabs = [...host.querySelectorAll('.atlas-explore-tab')];
  const panels = [...host.querySelectorAll('.atlas-explore-panel')];
  const previous = host.querySelector('[data-atlas-step="-1"]');
  const next = host.querySelector('[data-atlas-step="1"]');
  const position = host.querySelector('.atlas-explore-position');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let settleTimer = 0;

  // Only these two horizontal containers move. Never call scrollIntoView:
  // it can also move the page vertically and was the old accordion's weakness.
  function revealTab(index) {
    const tab = tabs[index];
    const bounds = tablist.getBoundingClientRect();
    const target = tab.getBoundingClientRect();
    const inset = 10;
    const overflow = target.left < bounds.left + inset
      ? target.left - bounds.left - inset
      : target.right > bounds.right - inset ? target.right - bounds.right + inset : 0;
    if (overflow) tablist.scrollBy({left:overflow, top:0, behavior:'auto'});
  }
  function updateSelection(index, {reveal = true} = {}) {
    if (index < 0 || index >= panels.length) return;
    const oldPanel = panels[activeIndex];
    if (index !== activeIndex && oldPanel.contains(document.activeElement)) {
      tabs[index].focus({preventScroll:true});
    }
    activeIndex = index;
    tabs.forEach((tab, number) => {
      const active = number === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[number].dataset.active = String(active);
      panels[number].inert = !active;
      if (active) panels[number].removeAttribute('aria-hidden');
      else panels[number].setAttribute('aria-hidden', 'true');
    });
    previous.disabled = index === 0;
    next.disabled = index === panels.length - 1;
    previous.setAttribute('aria-label', index ? `Previous collection: ${collections[index - 1].title}` : 'Previous collection');
    next.setAttribute('aria-label', index < panels.length - 1 ? `Next collection: ${collections[index + 1].title}` : 'Next collection');
    position.textContent = collections[index].title;
    if (reveal) revealTab(index);
  }
  function panelOffset(index) {
    return gallery.scrollLeft + panels[index].getBoundingClientRect().left - gallery.getBoundingClientRect().left;
  }
  function selectCollection(index, {focus = false, instant = false} = {}) {
    if (index < 0 || index >= panels.length) return;
    // Jump directly across multiple collections so intermediate cards cannot
    // become selected or announced during a long smooth scroll.
    const jump = Math.abs(index - activeIndex) > 1;
    clearTimeout(settleTimer);
    updateSelection(index);
    if (focus) tabs[index].focus({preventScroll:true});
    gallery.scrollTo({left:panelOffset(index), top:0, behavior:instant || jump || reducedMotion.matches ? 'instant' : 'smooth'});
  }
  function settleSelection() {
    clearTimeout(settleTimer);
    if (!gallery.clientWidth || !gallery.getClientRects().length) return;
    const start = gallery.getBoundingClientRect().left;
    let nearest = 0;
    let distance = Infinity;
    panels.forEach((panel, index) => {
      const delta = Math.abs(panel.getBoundingClientRect().left - start);
      if (delta < distance) { nearest = index; distance = delta; }
    });
    if (nearest !== activeIndex) updateSelection(nearest);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCollection(index));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = tabs.length - 1;
      else return;
      event.preventDefault();
      selectCollection(target, {focus:true});
    });
  });
  previous.addEventListener('click', () => selectCollection(activeIndex - 1));
  next.addEventListener('click', () => selectCollection(activeIndex + 1));
  // Native touch/trackpad scrolling provides momentum and leaves vertical page
  // gestures alone. scrollend is progressive enhancement; the timer is fallback.
  gallery.addEventListener('scroll', () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settleSelection, 140);
  }, {passive:true});
  gallery.addEventListener('scrollend', settleSelection);
  // On rotation/resize, align the selected panel to its new width. Hidden routes
  // report zero width and are left alone until Explore becomes visible again.
  if (typeof ResizeObserver !== 'undefined') {
    let lastWidth = 0;
    new ResizeObserver(() => {
      const width = gallery.clientWidth;
      if (width && width !== lastWidth) {
        selectCollection(activeIndex, {instant:true});
      }
      lastWidth = width;
    }).observe(gallery);
  }
  updateSelection(0, {reveal:false});
})();
