import {Capacitor} from '@capacitor/core';
import {LocalLLM} from '@capacitor/local-llm';
import {installDeviceApi} from './device-api.js';
import {conversationInput,conversationalResult,conversationInstructions} from './device-conversation.js';

const nativeIOS=Capacitor.isNativePlatform()&&Capacitor.getPlatform()==='ios';
if(nativeIOS)document.documentElement.classList.add('native-ios');

installDeviceApi();
let enabled=false,busy=false,availability='unknown';
let aiPreferred=true;try{aiPreferred=localStorage.getItem('scripturelens-device-ai')!=='off';}catch{}
function saveAI(value){aiPreferred=value;try{localStorage.setItem('scripturelens-device-ai',value?'on':'off');}catch{}}
const offlineFetch=globalThis.fetch;
globalThis.fetch=async(input,init)=>{
 const response=await offlineFetch(input,init);
 const url=new URL(typeof input==='string'?input:input.url,location.href);
 if(url.origin!==location.origin||url.pathname!=='/api/chat'||!response.ok||!enabled||busy)return response;
 let question;try{question=JSON.parse(init?.body||await input.clone().text());}catch{return response;}
 const result=await response.clone().json(),prompt=conversationInput(question.message,result,question.history);
 if(!prompt)return response;
 busy=true;const sessionId='scripture-'+Date.now();let timer;
 try{
  const operation=LocalLLM.prompt({sessionId,instructions:conversationInstructions,prompt:JSON.stringify(prompt),options:{temperature:0.2,maximumOutputTokens:256}});
  const output=await Promise.race([operation,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('On-device explanation timed out')),20000);})]);
  const generated=conversationalResult(output.text,prompt);
  if(!generated)return response;
  return new Response(JSON.stringify({...result,answer:generated.answer,details:'On-device AI explanation. Citations link to retrieved evidence; the explanation has not been independently verified.\n\nStored response: '+result.answer+'\n\n'+result.details,generation:'on-device'}),{status:200,headers:response.headers});
 }catch{return response;}
 finally{clearTimeout(timer);try{await LocalLLM.endSession({sessionId});}catch{}busy=false;}
};

document.addEventListener('DOMContentLoaded',()=>{
 if(nativeIOS){
  const syncAppearance=()=>window.webkit?.messageHandlers?.scriptureAppearance?.postMessage(document.body.classList.contains('dark')?'dark':'light');
  new MutationObserver(syncAppearance).observe(document.body,{attributes:true,attributeFilter:['class']});
  syncAppearance();
 }
 const settings=document.querySelector('#reader-settings');if(!settings)return;
 const control=document.createElement('button');control.type='button';control.className='secondary';control.textContent='Enable on-device AI';
 const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 status.textContent='Optional AI explains retrieved passages using this iPhone’s own model. No paid API or backend. It is enabled by default when the device model is ready.';
 settings.append(control,status);
 if(!Capacitor.isNativePlatform()){control.disabled=true;status.textContent='On-device AI is available in the native app on supported phones. Offline reading and search are ready in this preview.';return;}
 control.onclick=async()=>{
  if(enabled){enabled=false;saveAI(false);control.textContent='Enable on-device AI';status.textContent='On-device AI is off. Reading and search remain available offline.';return;}
  control.disabled=true;
  try{
   if(availability==='downloadable'){status.textContent='Downloading the device’s AI model. Reading and search remain available.';await LocalLLM.download();}
   ({status:availability}=await LocalLLM.systemAvailability());
   if(availability==='available'){enabled=true;saveAI(true);control.textContent='Disable on-device AI';status.textContent='On-device AI is enabled. Explanations are generated locally; check the linked sources.';}
   else if(availability==='downloadable'){control.textContent='Download on-device AI model';status.textContent='Your device needs a model download through Google Play Services. Tap Download to proceed; mobile data charges may apply.';}
   else {control.textContent='Check on-device AI availability';status.textContent=availability==='notready'?'The device model is not ready. Check again after setup finishes.':'This device’s AI model is unavailable. Offline reading and search still work.';}
  }catch{status.textContent='On-device AI could not start. Offline reading and search still work.';}
  finally{control.disabled=false;}
 };
 // Check the existing system model automatically; a required download stays explicit.
 if(aiPreferred)control.click();
});
