// Read-only local production handler with anonymous auth-boundary fixtures.
import http from 'node:http';
import worker from './built-worker.mjs';
const port = 8875;
http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {res.writeHead(405); res.end(); return;}
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (url.pathname === '/signin-with-chatgpt') {
      // This boundary belongs to Sites in production. Never contact/sign in.
      res.writeHead(200, {'content-type': 'text/html'}); res.end('Local sign-in resolution fixture'); return;
    }
    // Existence-only DB binding reaches the real unauthenticated session guard.
    // No authenticated identity or database reads/writes are simulated.
    const response = await worker.fetch(new Request(url, {method:req.method, headers:req.headers}), {DB:{}}, {});
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(req.method === 'HEAD' ? undefined : Buffer.from(await response.arrayBuffer()));
  } catch (error) {res.writeHead(500); res.end(error.message);}
}).listen(port, '127.0.0.1', () => console.log(`Local release smoke: http://127.0.0.1:${port}`));
