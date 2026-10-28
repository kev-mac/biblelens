import fs from 'node:fs';

// Only public, build-owned resources enter the offline cache. The corpus uses
// the same decorated chapters as the online API, including edition metadata.
export function packageOfflineApp(assets) {
 const release = JSON.parse(assets['/release.json'].body);
 assets['/assets/app-icon.png'] = {type:'image/png', encoding:'base64', body:fs.readFileSync('src/assets/app-icon.png').toString('base64')};
 assets['/manifest.webmanifest'] = {type:'application/manifest+json', body:JSON.stringify({
  id:'/', name:'BibleLens', short_name:'BibleLens', description:'Read and compare Bible texts.',
  start_url:'/#discover', scope:'/', display:'standalone', background_color:'#f7f8fa', theme_color:'#f7f8fa',
  icons:[{src:'/assets/app-icon.png',sizes:'1024x1024',type:'image/png',purpose:'any'}]
 })};
 const shell = Object.keys(assets).filter(url => url !== '/release.json' && !url.startsWith('/draft-') && !url.startsWith('/__'));
 // This endpoint contains only the public book catalog. No other API is cached.
 shell.push('/api/books','/offline-bible.json');
 assets['/service-worker.js'] = {type:'application/javascript; charset=utf-8', body:fs.readFileSync('src/service-worker.js','utf8')
  .replace("/*__FINGERPRINT__*/''",JSON.stringify(release.sourceHash)).replace('/*__SHELL__*/[]',JSON.stringify(shell))};
}
