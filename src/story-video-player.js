'use strict';
// This public HTTPS page gives native WebViews a real referring page. No notes,
// device tokens, cookies or account credentials enter the player protocol.
(() => {
 const ids=/*__STORY_VIDEO_IDS__*/[];
 const params=new URLSearchParams(location.search),id=params.get('video');
 const status=document.getElementById('status');let player,clock,ready=false;
 const send=(state,extra={})=>{if(parent!==window)parent.postMessage({type:'biblelens:story-video',state,...extra},'*');};
 const fail=()=>{clearInterval(clock);player?.destroy();player=undefined;status.hidden=false;status.textContent='Video unavailable. Return to the story to retry.';send('error');};
 if(!ids.includes(id)){fail();return;}
 window.onYouTubeIframeAPIReady=()=>{
  try {
   status.hidden=true;
   player=new YT.Player('player',{host:'https://www.youtube-nocookie.com',videoId:id,width:'100%',height:'100%',
    playerVars:{autoplay:params.get('autoplay')==='0'?0:1,mute:params.get('muted')==='1'?1:0,loop:params.get('loop')==='1'?1:0,playlist:id,playsinline:1,controls:1,cc_load_policy:1,origin:location.origin,start:Math.max(0,Math.floor(Number(params.get('start'))||0))},
    events:{onReady:()=>{ready=true;status.hidden=true;const frame=player.getIframe();frame.title='YouTube story video';frame.referrerPolicy='strict-origin-when-cross-origin';send('ready');},
     onStateChange:event=>{const states={'-1':'idle',0:'ended',1:'playing',2:'paused',3:'buffering',5:'paused'};send(states[event.data]||'idle');clearInterval(clock);if(event.data===1)clock=setInterval(()=>send('time',{time:player.getCurrentTime()}),1000);},
     onError:fail,onAutoplayBlocked:()=>{send('paused');send('blocked');}}
   });
  }catch{fail();}
 };
 window.addEventListener('message',event=>{
  if(event.source!==parent||event.origin!==params.get('parentOrigin')||event.data?.type!=='biblelens:story-video-command'||!ready||!player)return;
  if(event.data.action==='pause')player.pauseVideo();
  if(event.data.action==='restart'){player.seekTo(0,true);player.playVideo();}
  if(event.data.action==='mute'){if(event.data.muted)player.mute();else player.unMute();}
  if(event.data.action==='play'){if(event.data.muted)player.mute();else player.unMute();player.playVideo();}
 });
 const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.referrerPolicy='strict-origin-when-cross-origin';script.onerror=fail;document.head.appendChild(script);
 window.addEventListener('pagehide',()=>{clearInterval(clock);player?.destroy();});
})();
