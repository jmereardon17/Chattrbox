let socket;

const init = url => {
  socket = new WebSocket(url);
  console.log('connecting...');
};

const registerOpenHandler = handlerFn => {
  socket.onopen = () => {
    console.log('open');
    handlerFn();
  };
};

const registerMessageHandler = handlerFn => {
  socket.onmessage = async e => {
    const text = await e.data.text().then(text => text);
    const data = JSON.parse(text);
    handlerFn(data);
  };
};

const sendMessage = payload => {
  socket.send(JSON.stringify(payload));
};

export default { init, registerOpenHandler, registerMessageHandler, sendMessage };
