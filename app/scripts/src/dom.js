import { MD5 } from 'crypto-js';
import moment from 'moment/moment';

const createGravatarUrl = username => {
  const userhash = MD5(username);
  return `http://www.gravatar.com/avatar/${userhash.toString()}`;
};

export const promptForUsername = () => {
  const username = prompt('Enter a username');
  return username.toLowerCase();
};

export class ChatForm {
  constructor(formSel, inputSel) {
    this.form = document.querySelector(formSel);
    this.input = document.querySelector(inputSel);
  }

  init(submitCallback) {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const val = this.input.value;
      submitCallback(val);
      this.input.value = '';
    });
  }
}

export class ChatList {
  constructor(listSel, username) {
    this.list = document.querySelector(listSel);
    this.username = username;
  }

  drawMessage({ user: u, timestamp: t, message: m }) {
    const Row = document.createElement('li');
    Row.className = 'message-row';

    if (this.username === u) Row.classList.add('me');

    const message = document.createElement('p');

    message.innerHTML += `<span class="message-username">${u}</span>
      <span class="timestamp" data-time=${t}>${moment(t).fromNow()}</span>
    <span class="message-message">${m}</span>`;

    const img = document.createElement('img');
    img.src = createGravatarUrl(u);
    img.alt = u;

    Row.append(img);
    Row.append(message);
    this.list.append(Row);
    Row.children[0].scrollIntoView();
  }

  init() {
    this.timer = setInterval(() => {
      document.querySelectorAll('[data-time]').forEach(el => {
        const timestamp = new Date().setTime(el.getAttribute('data-time'));
        const ago = moment(timestamp).fromNow();
        el.textContent = ago;
      });
    }, 1000);
  }
}
