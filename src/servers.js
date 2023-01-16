import http from 'http';
import cluster from 'cluster';
import process from 'process';
import os from 'os';
import { routes } from './router.js';

export const single = async (server, port) => {
  server = http.createServer(routes);
  server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
};

let instance = 0;
let ports;

export async function multiple(server, multiport) {
  const cpus = os.cpus().length;

  const createPortList = () => {
    const ports = [];
    for (let i = 1; i <= cpus; i++) {
      ports.push([4000 + i]);
    }
    return ports;
  }
  ports = createPortList();

  if (cluster.isPrimary) {
    console.log(`Master cluster setting up ${cpus} workers`);
    console.log(`Primary ${process.pid} is running`);
    let worker, port;
    for (let i = 1; i <= cpus; i++) {
      port = Number(multiport) + i;
      worker = cluster.fork({port: port});
      server = http.createServer((req, res) => routes(req, res)).listen(Number(multiport) + i);
    }
  }
  else {
    server = http.createServer(async (req, res) => {
      await balancer(req, res);
      res.end();
    }).listen(multiport);
  }
};

async function balancer(req, res) {
  const url = `http://localhost:${ports[instance] === ports[ports.length] ? ((instance = 0), ports[instance]) : ports[instance]}${req.url}`;
  const options = {method: req.method, headers: {'content-type': 'application/json'}};

  const buffers = [];
  for await (let i of req) {
    buffers.push(i);
  }
  const body = Buffer.concat(buffers).toString();

  if (req.method === 'POST' || req.method === 'PUT') {
    options.body = body;
  }

  const response = await fetch(url, options);
  const result = await response.json();
  res.end(JSON.stringify(result));
  if (response) instance = instance + 1;
}