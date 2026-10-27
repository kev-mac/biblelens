import {transformSync} from 'esbuild';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const stylesheetTag = /<link\b[^>]*>/gi;
const scriptTag = /<script\b([^>]*)>[\s\S]*?<\/script\s*>/gi;
const attribute = (tag, name) => new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i').exec(tag)?.slice(1).find(value => value !== undefined);
export const assetDigest = body => createHash('sha256').update(body).digest('hex');
const assetPath = value => {
  const url = new URL(value, 'https://biblelens.invalid/');
  if (url.origin !== 'https://biblelens.invalid') throw Error('Startup asset must be local: ' + value);
  return url.pathname;
};

export function startupAssetReferences(html) {
  const css = [...html.matchAll(stylesheetTag)].filter(match => attribute(match[0], 'rel')?.toLowerCase() === 'stylesheet').map(match => {
    if (attribute(match[0], 'media') && attribute(match[0], 'media') !== 'all') throw Error('Startup stylesheet media must be preserved explicitly');
    return assetPath(attribute(match[0], 'href'));
  });
  const js = [...html.matchAll(scriptTag)].filter(match => attribute(match[1], 'src')).map(match => {
    if (!/\bdefer\b/i.test(match[1]) || /\basync\b/i.test(match[1]) || attribute(match[1], 'type')) throw Error('Only deferred classic startup scripts can be consolidated');
    return assetPath(attribute(match[1], 'src'));
  });
  return {css, js};
}

function stylesheetSource(path, source) {
  // The new bundle lives in /assets, while existing CSS can live at / or
  // /vendor. Preserve the original base for relative asset URLs.
  return source.replace(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/gi, (whole, quote, value) => {
    if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(value.trim())) return whole;
    const resolved = new URL(value.trim(), 'https://biblelens.invalid' + path);
    return `url("${resolved.pathname}${resolved.search}${resolved.hash}")`;
  });
}

// Hash the exact script text the bundle inserts, including its readiness marker.
const classicScriptText = (path, source) => source.replace(/\r\n?/g, '\n') + '\n;document.currentScript.dataset.biblelensReady = "true";\n//# sourceURL=' + path;
const scriptHash = source => "'sha256-" + createHash('sha256').update(source.replace(/\r\n?/g, '\n')).digest('base64') + "'";

export function classicScriptHashes(sources, {minify=false}={}) {
  return sources.map(({path,body})=>scriptHash(classicScriptText(path,minify?transformSync(body,{loader:'js',minify:true,target:['safari17','chrome119']}).code:body)));
}

export function classicScriptBundle(sources, {minify=false}={}) {
  if(minify)sources=sources.map(source=>({...source,body:transformSync(source.body,{loader:"js",minify:true,target:["safari17","chrome119"]}).code}));
  // A simple concatenation changes function hoisting across files: app.js
  // would call reader.js functions before their reader state is initialized.
  // Synchronous inline classic scripts retain each original execution boundary,
  // global lexical bindings, strict directives and DOMContentLoaded timing.
  // Sources are build-time files, never user input. No eval/Function or extra
  // network requests are used. Carry any hosting-provided CSP nonce forward.
  for (const {path, body} of sources) new vm.Script(body, {filename: path});
  return `'use strict';\n(() => {\n  const owner = document.currentScript;\n  const nonce = owner?.nonce || '';\n  const sources = ${JSON.stringify(sources.map(({path, body}) => [path, body]))};\n  for (const [path, source] of sources) {\n    const script = document.createElement('script');\n    if (nonce) script.nonce = nonce;\n    script.dataset.bundleSource = path;\n    script.textContent = (${classicScriptText.toString()})(path, source);\n    try {\n      document.head.appendChild(script);\n      if (script.dataset.biblelensReady !== 'true') throw new Error('Application startup failed: ' + path);\n    } finally { script.remove(); }\n  }\n  owner.dataset.biblelensReady = 'true';\n})();\n`;
}

export function consolidateStartupAssets(assets,{minify=false,cssOverride}={}) {
  const html = assets['/']?.body;
  if (!html) throw Error('Missing startup HTML');
  const references = startupAssetReferences(html);
  if (!references.css.length || !references.js.length) throw Error('Missing startup styles or scripts');
  const read = path => {
    const asset = assets[path];
    if (!asset || typeof asset.body !== 'string') throw Error('Missing startup asset: ' + path);
    return {path, body: asset.body};
  };
  const cssSources = references.css.map(read), jsSources = references.js.map(read);
  const cssSource = cssSources.map(({path, body}) => `/* Source: ${path} */\n${stylesheetSource(path, body)}\n`).join('\n');
  const css = minify?transformSync(cssOverride??cssSource,{loader:'css',minify:true,target:['safari17','chrome119']}).code:cssSource;
  const js = classicScriptBundle(jsSources,{minify});
  new vm.Script(js, {filename: 'app-bundle.js'});
  const manifest = {version: 1};
  for (const [kind, body, sources, type] of [['css', css, cssSources, 'text/css; charset=utf-8'], ['js', js, jsSources, 'application/javascript; charset=utf-8']]) {
    const sha256 = assetDigest(body), path = `/assets/app.${sha256.slice(0, 16)}.${kind}`;
    assets[path] = {type, body};
    manifest[kind] = {path, sha256, sources: sources.map(({path, body}) => ({path, sha256: assetDigest(body)}))};
  }
  assets['/assets/startup-manifest.json'] = {type: 'application/json; charset=utf-8', body: JSON.stringify(manifest)};
  const withoutOriginals = html.replace(stylesheetTag, tag => attribute(tag, 'rel')?.toLowerCase() === 'stylesheet' ? '' : tag).replace(scriptTag, (tag, attributes) => attribute(attributes, 'src') ? '' : tag);
  const pair = `<link rel="stylesheet" id="biblelens-app-styles" href="${manifest.css.path}"><script defer id="biblelens-app-script" src="${manifest.js.path}"></script>`;
  if (!/<\/head\s*>/i.test(withoutOriginals)) throw Error('Missing document head');
  const inline = [...withoutOriginals.matchAll(scriptTag)].map(match => match[0].replace(/^<script\b[^>]*>/i, '').replace(/<\/script\s*>$/i, ''));
  const hashes = [...new Set([...inline.map(scriptHash), ...classicScriptHashes(jsSources,{minify}), ...Object.values(assets).flatMap(asset=>asset.scriptHashes||[])])];
  // Inline styles support existing layout controls. Scripts use only exact build
  // hashes; no inline handlers, eval, remote scripts, objects or base overrides.
  const policy = ["default-src 'none'", "base-uri 'none'", "object-src 'none'", "frame-src 'none'", "form-action 'self'",
    "script-src 'self' " + hashes.join(' '), "script-src-attr 'none'", "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:", "img-src 'self' data: blob:", "worker-src 'self' blob:",
    "connect-src 'self' https://scripture-lens.kvn-mcgwn.chatgpt.site https://tiles.openfreemap.org"].join('; ');
  assets['/'].csp = policy;
  // Sites/Cloudflare injects an inline challenge with request-specific values
  // and no nonce. The web response reports this same policy; native enforces it
  // via a meta tag added only when writing the device bundle.
  assets['/'].body = withoutOriginals.replace(/<\/head\s*>/i, pair + '</head>');
  return manifest;
}

export function insertNativeContentSecurityPolicy(html, policy) {
  const charset = '<meta charset="utf-8">';
  if (!policy || !html.includes(charset)) throw Error('Missing native CSP or charset');
  if (/<meta\b[^>]*http-equiv=["']Content-Security-Policy/i.test(html)) throw Error('CSP meta already present');
  return html.replace(charset, charset + `<meta http-equiv="Content-Security-Policy" content="${policy}">`);
}

export function insertDeviceBootstrap(html) {
  const appScript = /<script\b(?=[^>]*\bid="biblelens-app-script")[^>]*>/i;
  if (!appScript.test(html)) throw Error('Missing generated application script');
  if (html.includes('id="biblelens-device-bootstrap"')) throw Error('Device bootstrap already present');
  return html.replace(appScript, tag => '<script defer id="biblelens-device-bootstrap" src="/device-bootstrap.js"></script>' + tag);
}
