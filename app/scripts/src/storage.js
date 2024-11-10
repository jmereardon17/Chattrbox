class Store {
  constructor(storageAPI) {
    this.api = storageAPI;
  }
  get() {
    return this.api.getItem(this.key);
  }

  set(value) {
    this.api.setItem(this.key, value);
  }
}

export class UserStore extends Store {
  constructor(key) {
    super(sessionStorage);
    this.key = key;
  }
}

export class MessageStore extends Store {
  constructor(key) {
    super(sessionStorage);
    this.key = key;
  }

  addMessage(newMessage) {
    let messages = JSON.parse(this.get());

    if (!messages) {
      messages = [newMessage];
      this.set(JSON.stringify(messages));
      return;
    }

    const messageExists = messages.some(msg => msg.user === newMessage.user && msg.message === newMessage.message);

    if (!messageExists) {
      messages.push(newMessage);
      this.set(JSON.stringify(messages));
    }
  }
}
