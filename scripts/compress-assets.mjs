import {gzipSync} from 'node:zlib';
// Store a negotiated web representation. Native packaging still writes the
// original bytes, including the exact content-fingerprinted startup files.
export function compressAssets(assets){
 for(const asset of Object.values(assets)){
  if(asset.encoding||!/(?:text\/|application\/(?:javascript|json))/.test(asset.type)||Buffer.byteLength(asset.body)<1024)continue;
  const compressed=gzipSync(asset.body,{level:9});
  if(compressed.length<Buffer.byteLength(asset.body))asset.gzip=compressed.toString('base64');
 }
}
