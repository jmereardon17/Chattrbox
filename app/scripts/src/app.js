import socket from './ws-client';
import { ChatForm, ChatList, promptForUsername } from './dom';
import { UserStore, MessageStore } from './storage';

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';

let userStore = new UserStore('x-chattrbox/u');
let messageStore = new MessageStore('x-chattrbox/m');
let username = userStore.get();
const messages = JSON.parse(messageStore.get());

if (!username) {
  username = promptForUsername();
  userStore.set(username);
}

class ChatApp {
  constructor() {
    this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    this.chatList = new ChatList(LIST_SELECTOR, username);

    socket.init('ws://localhost:3001');
    socket.registerOpenHandler(() => {
      this.chatForm.init(text => {
        const message = new ChatMessage({ message: text });
        socket.sendMessage(message.serialize());
      });
    });
    messages?.forEach(msg => this.chatList.drawMessage(msg));
    this.chatList.init();
    socket.registerMessageHandler(data => {
      const message = new ChatMessage(data).serialize();
      messageStore.addMessage(message);
      this.chatList.drawMessage(message);
    });
  }
}

class ChatMessage {
  constructor({ message: m, user: u = username, timestamp: t = new Date().getTime() }) {
    this.message = m;
    this.user = u;
    this.timestamp = t;
  }
  serialize() {
    return {
      user: this.user,
      message: this.message,
      timestamp: this.timestamp
    };
  }
}

export default ChatApp;
