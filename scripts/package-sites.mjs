import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export function checkSitesPackage(directory) {
  const hosting = JSON.parse(fs.readFileSync(path.join(directory, '.openai/hosting.json'), 'utf8'));
  if (hosting.static) throw Error('Sites package must route all requests through the Worker');
  const entries = fs.readdirSync(directory).sort();
  if (JSON.stringify(entries) !== JSON.stringify(['.openai', 'server']))
    throw Error('Sites package permits only server and .openai; static assets may bypass Worker headers');
  const worker = fs.readFileSync(path.join(directory, 'server/index.js'), 'utf8');
  if (!worker.includes('const COMPRESSED_ASSETS=') || worker.includes('const EMBEDDED_ASSETS=null;'))
    throw Error('Sites requires the self-contained embedded asset fallback');
}

export function packageSites(source, destination) {
  if (path.resolve(source) === path.resolve(destination)) throw Error('Keep the shared build intact');
  const manifest = JSON.parse(fs.readFileSync(path.join(source, 'asset-manifest.json'), 'utf8'));
  if (manifest.mode !== 'compressed') throw Error('Experimental static build cannot be published to Sites');
  // Validate before replacing an existing staging directory.
  const worker = fs.readFileSync(path.join(source, 'server/index.js'), 'utf8');
  if (!worker.includes('const COMPRESSED_ASSETS=')) throw Error('Missing embedded asset fallback');
  fs.rmSync(destination, {recursive: true, force: true});
  fs.mkdirSync(destination, {recursive: true});
  for (const name of ['server', '.openai']) fs.cpSync(path.join(source, name), path.join(destination, name), {recursive: true});
  checkSitesPackage(destination);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const destination = process.argv[2];
  if (!destination) throw Error('Usage: npm run release:sites -- /absolute/path/to/mirror/dist');
  packageSites('dist', destination);
  console.log('Sites Worker-only package ready:', destination);
}
