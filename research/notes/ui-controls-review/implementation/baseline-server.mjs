// Read an already-existing bundle; never build or write release output.
import http from 'node:http';
import {pathToFileURL} from 'node:url';
const {default:worker}=await import(pathToFileURL(process.argv[2]));
http.createServer(async(req,res)=>{try{
 if(req.method!=='GET'||req.url.startsWith('/api/sync')){res.writeHead(405);res.end();return;}
 const response=await worker.fetch(new Request('http://127.0.0.1:8792'+req.url),{},{});
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
}catch(e){res.writeHead(500);res.end(e.message);}}).listen(8792,'127.0.0.1',()=>console.log('Existing baseline served at http://127.0.0.1:8792'));
