"""Build-free preview: serve edited source directly, use existing unchanged module bundles.
No release output, bundling, installation, cloud account, or note traffic is involved.
"""
from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
from pathlib import Path
import urllib.request, urllib.error, json, mimetypes
ROOT=Path(__file__).resolve().parents[4]
REMOTE='http://127.0.0.1:8792'
cache={}
def remote(path):
 if path not in cache:
  with urllib.request.urlopen(REMOTE+path,timeout=45) as r:cache[path]=(r.headers.get('Content-Type','application/javascript'),r.read())
 return cache[path]
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  path=self.path.split('?')[0]
  try:
   if path=='/api/sync/session':
    kind='application/json';body=b'{"authenticated":false}'
   elif path=='/release.json':
    kind='application/json';body=b'{"version":"Local source preview","buildNumber":241,"sourceHash":"preview-only"}'
   elif path=='/favicon.ico':
    kind='image/x-icon';body=b''
   elif path=='/':
    body=(ROOT/'src/index.html').read_text().replace('<script defer src="places.js"></script>','<script type="module" src="places.js"></script>')
    kind='text/html';body=body.encode()
   elif path=='/places.js':
    body=(ROOT/'src/places.js').read_text().replace("from 'leaflet'","from '/preview-leaflet.js'").replace("from './data/atlas-land.json'","from './data/atlas-land.json' with {type:'json'}")
    kind='application/javascript';body=body.encode()
   elif path=='/preview-leaflet.js':
    if path not in cache:
     cache[path]=('application/javascript',Path('/Users/kevin/.codex/worktrees/8e4f/BibleLens/node_modules/leaflet/dist/leaflet-src.esm.js').read_bytes())
    kind,body=cache[path]
   elif path in ['/characters.js','/prophecies.js','/timeline.js','/reviewed-timeline.js','/leaflet.css','/stories.json'] or path.startswith('/api/') or (path.startswith('/reference/') and not (ROOT/'data'/path.lstrip('/')).is_file()):
    kind,body=remote(self.path)
   elif path=='/reader.js':
    names={k:v for k,v in json.loads((ROOT/'data/chapter-names.json').read_text()).items() if not k.startswith('_')}
    body=(ROOT/'src/reader.js').read_text().replace('/*__CHAPTER_NAMES__*/{}',json.dumps(names)).encode();kind='application/javascript'
   elif path=='/commandments.js':
    records=json.loads((ROOT/'data/commandments-catalog.json').read_text())['records']
    body=(ROOT/'src/commandments.js').read_text().replace('/*__COMMANDMENTS__*/[]',json.dumps(records)).encode();kind='application/javascript'
   else:
    if path=='/timeline.css':file=ROOT/'src/components/timeline/TimelineEventCard.css'
    elif path.startswith('/reference/'):file=ROOT/'data'/path.lstrip('/')
    else:file=ROOT/'src'/path.lstrip('/')
    if ROOT not in file.resolve().parents:raise FileNotFoundError()
    body=file.read_bytes();kind=mimetypes.guess_type(str(file))[0] or 'application/octet-stream'
   self.send_response(200);self.send_header('Content-Type',kind);self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(body)
  except Exception as e:
   self.send_response(500);self.end_headers();self.wfile.write(str(e).encode())
 def do_POST(self):
  # Chat preview uses a browser fixture. Never proxy mutations or private sync.
  self.send_response(405);self.end_headers()
ThreadingHTTPServer(('127.0.0.1',8791),Handler).serve_forever()
