'use strict';

//
// YOUR CODE GOES HERE...
//
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░░░
// ░░░░░░░░▄▀░░░░░░░░░░░░▄░░░░░░░▀▄░░░░░░░░
// ░░░░░░░░█░░▄░░░░▄░░░░░░░░░░░░░░█░░░░░░░░
// ░░░░░░░░█░░░░░░░░░░░░▄█▄▄░░▄░░░█░▄▄▄░░░░
// ░▄▄▄▄▄░░█░░░░░░▀░░░░▀█░░▀▄░░░░░█▀▀░██░░░
// ░██▄▀██▄█░░░▄░░░░░░░██░░░░▀▀▀▀▀░░░░██░░░
// ░░▀██▄▀██░░░░░░░░▀░██▀░░░░░░░░░░░░░▀██░░
// ░░░░▀████░▀░░░░▄░░░██░░░▄█░░░░▄░▄█░░██░░
// ░░░░░░░▀█░░░░▄░░░░░██░░░░▄░░░▄░░▄░░░██░░
// ░░░░░░░▄█▄░░░░░░░░░░░▀▄░░▀▀▀▀▀▀▀▀░░▄▀░░░
// ░░░░░░█▀▀█████████▀▀▀▀████████████▀░░░░░░
// ░░░░░░████▀░░███▀░░░░░░▀███░░▀██▀░░░░░░░
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//
// Nyan cat lies here...

const WebSocket = require('ws');
const {randColor, getToken} = require('../lib/helpers');
const LifeGameVirtualDom = require('../lib/LifeGameVirtualDom');

/**
 * @override sendUpdates Метод рассылки данных клиентам
 * @param  {Object} data Данные
 * @return {void}
 */
LifeGameVirtualDom.prototype.sendUpdates = data => {
  wss.clients.forEach(client => {
      if (client.readyState !== WebSocket.OPEN) return;

      const payload = JSON.stringify({
        type: 'UPDATE_STATE',
        data: {
          fields: data,
          players: game.players
        }
      });
      client.send(payload);
  })
};

const game = new LifeGameVirtualDom();

// Создадим сервер
const wss = new WebSocket.Server({
  port: 8080,
  verifyClient(info) {
    const token = getToken(info.req);
    return !!token;
  }
});

// Обработчик подключения
wss.on('connection', (ws, req) => {

  const user = {
    token: getToken(req),
    color: randColor(),
    population: 0
  };

  // Начальное состояние
  const initPayload = JSON.stringify({
  	type: 'INITIALIZE',
  	data: {
  		state: game.state,
  		settings: game.settings,
      players: game.players,
  		user
  	}
  });

  game.addPlayer(user);
  ws.send(initPayload);

  // Обработчик получение сообщений от клиентов
  ws.on('message', (msg) => {
    const message = JSON.parse(msg);
    if (message.type === 'ADD_POINT') {
      game.applyUpdates(message.data);
    }
  });
});
