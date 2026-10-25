'use strict';
// Native disclosures keep touch, mouse and keyboard behavior consistent across directories.
// Reviewed timeline cards already own an Academic comparison disclosure.
const COLLAPSED_CARD_SELECTOR='.prophecy-card,.timeline-card,.passage-saved-card,.category-directory-card,#cards > .card,#saved-cards > .card';
const collapsedCards=new WeakSet();
function collapseDirectoryCard(card){
 if(collapsedCards.has(card))return;
 const title=card.querySelector('h2,h3,[data-open],.verse-citation,[data-read]');
 if(!title)return;
 collapsedCards.add(card);
 const preview=document.createElement('div');preview.className='card-disclosure-preview';
 preview.append(title);
 const summaryText=card.querySelector('.character-summary,.commandment-summary,.passage-saved-note,.timeline-event-summary,:scope > p:not(.eyebrow)');
 if(summaryText)preview.append(summaryText);
 const disclosure=document.createElement('details');disclosure.className='card-disclosure';
 const summary=document.createElement('summary');summary.className='card-disclosure-heading';
 const label=document.createElement('span');label.className='card-disclosure-label';label.textContent='Details';summary.append(label);
 if(card.matches('.prophecy-card')){
  summary.className+=' card-disclosure-icon';
  summary.setAttribute('aria-label','Passages and interpretation for '+title.textContent);
  label.textContent='';label.setAttribute('aria-hidden','true');
 }
 const content=document.createElement('div');content.className='card-disclosure-content';
 content.append(...card.childNodes);disclosure.append(summary,content);card.append(preview,disclosure);
}
function collapseDirectoryCards(root){
 if(root.nodeType!==1)return;
 if(root.matches(COLLAPSED_CARD_SELECTOR))collapseDirectoryCard(root);
 root.querySelectorAll(COLLAPSED_CARD_SELECTOR).forEach(collapseDirectoryCard);
}
function resetCardDisclosures(){
 document.querySelectorAll('main details[open],#story-topic-sheet details[open],#atlas-sources[open]').forEach(node=>{node.open=false;});
 if(typeof comparisonEvidenceOpen!=='undefined')comparisonEvidenceOpen.clear();
 document.querySelectorAll('.person-section-toggle,.character-detail-toggle,.character-summary-toggle,[data-timeline-history],.timeline-history').forEach(button=>{
  button.setAttribute('aria-expanded','false');const label=button.getAttribute('aria-label');if(label?.startsWith('Collapse '))button.setAttribute('aria-label','Expand '+label.slice(9));const panel=document.getElementById(button.getAttribute('aria-controls'));
  if(panel){if(panel.classList.contains('timeline-discrepancy')){panel.classList.remove('is-expanded');panel.setAttribute('aria-hidden','true');panel.inert=true;}else panel.hidden=true;}
 });
 document.querySelectorAll('.comparison-evidence').forEach(node=>{node.hidden=true;});
 document.querySelectorAll('[data-summary-toggle],[data-summary-expand]').forEach(node=>{node.setAttribute('aria-expanded','false');if(node.hasAttribute('data-summary-expand'))node.setAttribute('aria-label','Expand '+(node.dataset?.summaryLabel||'references and reasoning'));});
}
function mountCollapsedCards(){
 collapseDirectoryCards(document.body);
 const observer=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)collapseDirectoryCards(node);});
 observer.observe(document.body,{childList:true,subtree:true});
 window.addEventListener('viewchange',resetCardDisclosures);
}
window.addEventListener('DOMContentLoaded',mountCollapsedCards);
