import fs from 'node:fs';

// Only reviewed, uploaded videos enter either client. Keep the approved media
// hosts explicit: no arbitrary URL, credentials or signed query reaches clients.
export const STORY_VIDEO_ORIGINS = Object.freeze(['https://pub-9f1a7f52c7d046daba4df355a08ed8cd.r2.dev']);
export function storyVideos(records, images, root='src') {
 const active={};
 for(const [title,video] of Object.entries(records)) {
  if(!images[title])throw Error('Unknown video story: '+title);
  if(!['youtube','mp4'].includes(video.provider)||!['pending','ready'].includes(video.status))throw Error('Invalid video status/provider: '+title);
  if(video.status==='pending')continue;
  let source;
  if(video.provider==='youtube') {
   if(!/^[A-Za-z0-9_-]{11}$/.test(video.videoId||''))throw Error('Invalid YouTube video ID: '+title);
   source={videoId:video.videoId};
  } else {
   let url;try{url=new URL(video.src);}catch{throw Error('Invalid MP4 video URL: '+title);}
   if(!STORY_VIDEO_ORIGINS.includes(url.origin)||url.username||url.password||url.search||url.hash||!/^\/[A-Za-z0-9_/-]+\.mp4$/.test(url.pathname)||url.href!==video.src)throw Error('Invalid MP4 video URL: '+title);
   source={src:url.href};
  }
  if(!/^\/assets\/story-video-[a-z0-9-]+-poster-v\d+\.webp$/.test(video.poster||''))throw Error('Invalid video poster: '+title);
  if(!fs.existsSync(root+video.poster))throw Error('Missing video poster: '+title);
  for(const field of ['posterAlt','description'])if(typeof video[field]!=='string'||!video[field].trim())throw Error('Missing video '+field+': '+title);
  active[title]={provider:video.provider,...source,poster:video.poster,posterAlt:video.posterAlt,description:video.description};
 }
 return active;
}
