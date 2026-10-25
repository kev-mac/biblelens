'use strict';
// Study Atlas is a presentation layer. Existing routes, person IDs and the
// shared data-place-id handler continue to open the real research records.
(() => {
  const host = document.getElementById('discover-view');
  if (!host || host.dataset.studyAtlas === 'ready') return;
  const starterStudies = host.querySelector('.lens-starter-studies');
  const collections = [
    {route:'places', image:'places', title:'Places', kicker:'Geography', heading:'The Land Behind the Lines.', copy:'Trace a setting. Open a place. See the world a passage moves through.', action:'Explore places', alt:'An illustrated ancient hilltop city, winding paths and distant mountains in warm light.', related:'Start in <button type="button" data-place-id="recL1WV82pXaRBQ59" aria-haspopup="dialog" aria-controls="atlas-sheet" aria-label="Explore Jerusalem in the atlas">Jerusalem</button>, <button type="button" data-place-id="recmRfnw4XzPBH9jc" aria-haspopup="dialog" aria-controls="atlas-sheet" aria-label="Explore Nazareth in the atlas">Nazareth</button> or <button type="button" data-place-id="rectrAkGtrZH5LMp8" aria-haspopup="dialog" aria-controls="atlas-sheet" aria-label="Explore Beersheba in the atlas">Beersheba</button>.'},
    {route:'people', image:'people', title:'People', kicker:'People & connections', heading:'A Story Runs Through a Family.', copy:'Follow the lives, relationships and encounters that connect one chapter to the next.', action:'Meet the people', alt:'An imagined ancient Near Eastern family: an older man and woman with a young listener.', related:'Begin with <a href="#characters/reccdFYIq50NyxNej">Abraham</a>, <a href="#characters/rechda7WMDuW1jBTq">Sarah</a> and <a href="#characters/recqIoG1fkaNWJ1y0">Isaac</a> in <a href="#read/0/21/3">Genesis 21:3</a>.'},
    {route:'stories', image:'stories', title:'Stories', kicker:'Narratives', heading:'Begin With a Story.', copy:'Creation, kinship, journeys. Read familiar passages as part of a larger narrative.', action:'Explore stories', alt:'An illustrated journey across a sweeping ancient landscape.'},
    {route:'categories', image:'evidence', title:'Evidence', kicker:'Text & interpretation', heading:'A Closer Look Changes the View.', copy:'Compare the text with historical context, alternate readings and the sources behind a claim.', action:'Examine the evidence', alt:'Illustrated hands examining the parchment layers of an old manuscript in warm window light.'},
    {route:'timeline', image:'timeline', title:'Timeline', kicker:'Chronology', heading:'See the Story Across Time.', copy:'Place events in context while keeping disputed dates and uncertain sequences in view.', action:'Explore the timeline', alt:'An illustrated landscape of ancient architecture and civilizations across successive eras.'},
    {route:'commandments', image:'commandments', title:'Commandments', kicker:'Law & daily life', heading:'From Text to a Way of Life.', copy:'Explore the 613 traditionally enumerated commandments by subject and passage.', action:'Explore commandments', alt:'An imagined desert mountain pass with two weathered stone tablets on a ledge.'},
    {route:'prophecies', image:'prophecies', title:'Prophecies', kicker:'Words & interpretation', heading:'One Text. More Than One Reading.', copy:'Follow how prophetic passages have been interpreted, with the claims and their limits kept visible.', action:'Explore prophecies', alt:'An illustrated ancient observer looking toward a distant city under a dramatic sky.', note:'3 illustrative records · review pending.'},
    {route:'method', image:'method', title:'Method & Sources', kicker:'How BibleLens works', heading:'Curiosity Deserves a Clear Method.', copy:'See where the material comes from, how claims are handled and where the collection is incomplete.', action:'Read our method', alt:'An imagined archaeological worktable with a repaired clay vessel, fragments and a reference notebook.'}
  ];
  const arrow = direction => `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="${direction === 'previous' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  host.dataset.studyAtlas = 'ready';
  host.classList.add('atlas-explore');
  host.innerHTML = `
    <div class="atlas-explore-heading"><div><span class="atlas-explore-eyebrow">The study atlas</span><h1 tabindex="-1">Follow the Thread.</h1></div><p>A place leads to a person.<br> A person opens a story.</p></div>
    <div class="atlas-explore-tabs" role="tablist" aria-label="Explore collections" aria-orientation="horizontal">${collections.map((item, index) => `<button type="button" role="tab" id="atlas-explore-tab-${item.route}" class="atlas-explore-tab" aria-selected="${index === 0}" aria-controls="atlas-explore-panel-${item.route}" tabindex="${index === 0 ? '0' : '-1'}">${item.title}</button>`).join('')}</div>
    <div class="atlas-explore-gallery" aria-label="Illustrated collections">${collections.map((item, index) => `
      <section class="atlas-explore-panel" id="atlas-explore-panel-${item.route}" role="tabpanel" aria-labelledby="atlas-explore-tab-${item.route}" data-active="${index === 0}"${index === 0 ? '' : ' aria-hidden="true" inert'}>
        <div class="atlas-explore-feature atlas-explore-feature-${item.route}">
          <div class="atlas-explore-visual"><img class="atlas-explore-image" src="/assets/explore-${item.image}.webp" alt="${item.alt}" width="1200" height="800" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"${index === 0 ? ' fetchpriority="high"' : ''}></div>
          <div class="atlas-explore-copy"><span class="atlas-explore-eyebrow">${item.kicker}</span><h2>${item.heading}</h2><p>${item.copy}</p><a class="atlas-explore-action" href="#${item.route}">${item.action}<span aria-hidden="true">↗</span></a>${item.related ? `<p class="atlas-explore-related">${item.related}</p>` : ''}${item.note ? `<small class="atlas-explore-source">${item.note}</small>` : ''}</div>
        </div>
      </section>`).join('')}</div>
    <div class="atlas-explore-gallery-footer"><p class="atlas-explore-position" aria-live="polite" aria-atomic="true"><span class="atlas-explore-position-label">Places</span><span aria-hidden="true">01 / 08</span></p><div class="atlas-explore-gallery-controls"><button type="button" class="atlas-explore-step" data-atlas-step="-1" aria-label="Previous collection" disabled>${arrow('previous')}</button><button type="button" class="atlas-explore-step" data-atlas-step="1" aria-label="Next collection: People">${arrow('next')}</button></div></div>
    <p class="atlas-explore-art-note">Illustrated scenes, not historical reconstructions.</p>
    <div class="atlas-explore-studies"></div>
    <p class="atlas-explore-coverage">Reference coverage varies. A missing annotation is not a verdict of agreement or historical accuracy.</p>`;

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
    position.innerHTML = `<span class="atlas-explore-position-label">${collections[index].title}<span class="sr-only">, ${index + 1} of ${panels.length}</span></span><span aria-hidden="true">${String(index + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')}</span>`;
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
