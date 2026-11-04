import fs from 'node:fs';

// Only reviewed, uploaded videos enter either client. Pending records make no
// remote requests and keep the existing Story and reader artwork intact.
export function storyVideos(records, images, root='src') {
 const active={};
 for(const [title,video] of Object.entries(records)) {
  if(!images[title])throw Error('Unknown video story: '+title);
  if(video.provider!=='youtube'||!['pending','ready'].includes(video.status))throw Error('Invalid video status/provider: '+title);
  if(video.status==='pending')continue;
  if(!/^[A-Za-z0-9_-]{11}$/.test(video.videoId||''))throw Error('Invalid YouTube video ID: '+title);
  if(!/^\/assets\/story-video-[a-z0-9-]+-poster-v\d+\.webp$/.test(video.poster||''))throw Error('Invalid video poster: '+title);
  if(!fs.existsSync(root+video.poster))throw Error('Missing video poster: '+title);
  for(const field of ['posterAlt','description'])if(typeof video[field]!=='string'||!video[field].trim())throw Error('Missing video '+field+': '+title);
  active[title]={videoId:video.videoId,poster:video.poster,posterAlt:video.posterAlt,description:video.description};
 }
 return active;
}
