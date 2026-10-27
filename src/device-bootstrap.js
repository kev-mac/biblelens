import {Capacitor} from '@capacitor/core';
import {installDeviceApi} from './device-api.js';
const nativeIOS=Capacitor.isNativePlatform()&&Capacitor.getPlatform()==='ios';
if(nativeIOS)document.documentElement.classList.add('native-ios');
installDeviceApi();
// API interception stays eager; optional inference and plugin setup wait for use.
let ai;
function loadAI(){
 const modulePath='./device-ai.js';
 return ai ||= import(modulePath).then(module=>module.installDeviceAI(Capacitor)).catch(error=>{ai=null;throw error;});
}
const offlineFetch=globalThis.fetch;
globalThis.fetch=async(input,init)=>{
 const response=await offlineFetch(input,init);
 const url=new URL(typeof input==='string'?input:input.url,location.href);
 if(url.origin!==location.origin||url.pathname!=='/api/chat'||!response.ok)return response;
 try{return await (await loadAI()).enhance(response,input,init);}catch{return response;}
};
document.addEventListener('DOMContentLoaded',()=>{
 if(nativeIOS){
  const syncAppearance=()=>window.webkit?.messageHandlers?.scriptureAppearance?.postMessage(document.body.classList.contains('dark')?'dark':'light');
  new MutationObserver(syncAppearance).observe(document.body,{attributes:true,attributeFilter:['class']});syncAppearance();
 }
 const settings=document.querySelector('#reader-settings');
 if(settings)new MutationObserver(()=>{if(settings.open)loadAI().catch(()=>{});}).observe(settings,{attributes:true,attributeFilter:['open']});
});
