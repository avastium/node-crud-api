import http from 'http';
import * as dotenv from 'dotenv';
import * as servers from './servers.js';

dotenv.config();

export let server = http.createServer();

if (process.env.TYPE === 'single') await servers.single(server, process.env.PORT);
if (process.env.TYPE === 'multiple') await servers.multiple(server, process.env.PORT);