'use strict';
// This is the only client path to paid search. Call it from an intentional
// question/search submission; local autocomplete never calls it.
(() => {
 const cloud='https://scripture-lens.kvn-mcgwn.chatgpt.site';
 const isNative=()=>document.documentElement.classList.contains('native-ios')||!!document.querySelector('script[src*="device-bootstrap"]');
 const escape=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
 function safeLink(value){
  if(/^#(?:read\/\d+\/\d+(?:\/[\d,-]+)?|study\/[\w-]+|debate\/[\w%-]+|characters\/[\w%-]+|stories\/[\w-]+\/[\w-]+)$/.test(value||''))return value;
  try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password&&(!url.port||url.port==='443')&&/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(url.hostname)&&!/(?:^|\.)(?:localhost|local|internal|test|invalid|example|onion)$/.test(url.hostname)?url.href:null;}catch{return null;}
 }
 function render(result){
  if(result?.status!=='ready')return '<p class="combined-status" role="status">'+escape(result?.message||'Online answers are unavailable. App search is available.')+'</p>';
  const text=(result.parts||[]).map(part=>{
   const url=part.sourceType&&safeLink(part.url);
   return url?'<a class="combined-citation" href="'+escape(url)+'"'+(url.startsWith('https:')?' target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer"':'')+'>'+escape(part.text)+'</a>':escape(part.text);
  }).join('');
  return '<section class="combined-answer" aria-label="OpenAI answer with app and web sources"><h3>OpenAI · App + Web</h3><p class="combined-provenance">AI answer · Check the linked sources'+(result.cached?' · Recent answer':'')+'</p><div class="combined-answer-text">'+text+'</div></section>';
 }
 async function answer(query,edition,{signal}={}){
  query=String(query||'').trim();
  if(!query||query.length>1200)return {status:'unavailable',message:'Online answers accept questions up to 1,200 characters. App search is available.'};
  if(navigator.onLine===false)return {status:'offline',message:'You are offline. App search is still available.'};
  const native=isNative();
  let token;
  if(native){try{const meta=JSON.parse(localStorage.getItem('biblelens-cloud-sync-v1')||'{}');if(meta.enabled&&!meta.disconnectPending&&/^[a-f0-9]{64}$/.test(meta.token||''))token=meta.token;}catch{}
   if(!token)return {status:'unavailable',message:'Connect this device in Settings > Cloud Sync to use the online trial.'};
  }
  const controller=new AbortController(),abort=()=>controller.abort(),timer=setTimeout(abort,35000);
  if(signal){if(signal.aborted)abort();else signal.addEventListener('abort',abort,{once:true});}
  try{
   const response=await fetch((native?cloud:'')+'/api/answer',{method:'POST',credentials:native?'omit':'same-origin',headers:{'content-type':'application/json','x-biblelens-ai':'1',...(token?{authorization:'Bearer '+token}:{})},body:JSON.stringify({query,edition}),signal:controller.signal});
   if(!response.headers.get('content-type')?.includes('application/json'))throw Error('Invalid online response');
   const result=await response.json();return result&&typeof result.status==='string'?result:{status:'unavailable',message:'Online answers could not load. App search is available.'};
  }catch{return {status:'unavailable',message:controller.signal.aborted?'The online answer timed out or was cancelled. App results are still available.':'Online answers could not load. App results are still available.'};}
  finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
 }
 window.BibleLensCombined={answer,render,safeLink};
 document.addEventListener?.('DOMContentLoaded',()=>{
  const access=document.getElementById('online-trial-access');if(!access)return;
  if(isNative()){access.textContent='Use online search on the website first. Then connect this device in Settings > Cloud Sync.';return;}
  const link=document.createElement('a');link.href='/signin-with-chatgpt?return_to=%2F%23chat';link.target='_top';link.textContent='Sign in';access.append(link);
 });
})();
