'use strict';
// This public HTTPS page gives native WebViews a real referring page. No notes,
// device tokens, cookies or account credentials enter the player protocol.
(() => {
 const ids=/*__STORY_VIDEO_IDS__*/[];
 const params=new URLSearchParams(location.search),id=params.get('video');
 const status=document.getElementById('status');let player,clock;
 const send=(state,extra={})=>{if(parent!==window)parent.postMessage({type:'biblelens:story-video',state,...extra},'*');};
 const fail=()=>{clearInterval(clock);player?.destroy();player=undefined;status.hidden=false;status.textContent='Video unavailable. Return to the story to retry.';send('error');};
 if(!ids.includes(id)){fail();return;}
 window.onYouTubeIframeAPIReady=()=>{
  try {
   status.hidden=true;
   player=new YT.Player('player',{host:'https://www.youtube-nocookie.com',videoId:id,width:'100%',height:'100%',
    playerVars:{autoplay:1,playsinline:1,controls:1,cc_load_policy:1,origin:location.origin,start:Math.max(0,Math.floor(Number(params.get('start'))||0))},
    events:{onReady:()=>{status.hidden=true;const frame=player.getIframe();frame.title='YouTube story video';frame.referrerPolicy='strict-origin-when-cross-origin';send('ready');},
     onStateChange:event=>{const states={'-1':'ready',0:'ended',1:'playing',2:'paused',3:'buffering',5:'paused'};send(states[event.data]||'ready');clearInterval(clock);if(event.data===1)clock=setInterval(()=>send('time',{time:player.getCurrentTime()}),1000);},
     onError:fail,onAutoplayBlocked:()=>send('paused')}
   });
  }catch{fail();}
 };
 const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.referrerPolicy='strict-origin-when-cross-origin';script.onerror=fail;document.head.appendChild(script);
 window.addEventListener('pagehide',()=>{clearInterval(clock);player?.destroy();});
})();
