import {buildSync} from 'esbuild';
// Test classic consumers with the same bridge entry as the packaged application.
export const sharedUISource=buildSync({entryPoints:['src/shared-ui.js'],bundle:true,write:false,format:'iife',platform:'browser'}).outputFiles[0].text;
