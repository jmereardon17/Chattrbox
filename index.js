import { createServer } from 'http';
import fileHandler from './fileHandler.js';
import path from 'path';
import './websockets-server.js';

const baseFolder = path.join(process.cwd(), 'app');
const { handleFileRequest } = fileHandler(baseFolder);

const server = createServer((req, res) => {
  handleFileRequest(req, res);
});

server.listen(3000);
