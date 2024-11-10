import { WebSocketServer } from 'ws';

const port = 3001;
const ws = new WebSocketServer({ port: port });
const messages = [];

console.log('websockets server started!');

ws.on('connection', socket => {
  console.log('client connection established');

  // show previous messages to new users connecting
  messages.forEach(msg => socket.send(msg));

  // setup the server to repeat any messages sent to it
  socket.on('message', data => {
    console.log(`message received: ${data}`);
    messages.push(data);
    ws.clients.forEach(clientSocket => clientSocket.send(data));
  });
});

export default ws;
