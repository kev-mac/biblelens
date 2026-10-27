import {assetDigest,classicScriptBundle,classicScriptHashes} from './startup-assets.mjs';
export const featureSources={
 study:['reader-links.js','reader-data.js','passage.js','stories.js','reader.js','workspace.js','atlas-reader.js','citations.js'],
 evidence:['marked.js','categories.js'],
 debates:['debates.js'],
 characters:['characters.js'],
 'places-directory':['places-directory.js'],
 map:['places.js'],
 references:['reference-links.js'],
 timeline:['timeline.js','reviewed-timeline.js'],
 commandments:['commandments.js'],
 prophecies:['prophecies.js']
};
export function packageFeatures(assets,stylePath,studyStylePath){
 const manifest={styles:stylePath,studyStyles:studyStylePath};
 for(const [name,paths]of Object.entries(featureSources)){
  const body=classicScriptBundle(paths.map(path=>({path:'/'+path,body:assets['/'+path].body})),{minify:true});
  const path=`/assets/${name}.${assetDigest(body).slice(0,16)}.js`;
  assets[path]={type:'application/javascript; charset=utf-8',body,scriptHashes:classicScriptHashes(paths.map(path=>({path:'/'+path,body:assets['/'+path].body})),{minify:true})};manifest[name]=path;
 }
 assets['/feature-loader.js'].body=assets['/feature-loader.js'].body.replace('/*__FEATURES__*/{}',JSON.stringify(manifest));
 return manifest;
}
