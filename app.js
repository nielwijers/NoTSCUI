var express = require('express');
var Bot = require('./botApp.js');
var server = express();

const bot = new Bot.Bot();
bot.init();

server.listen(3978, function () {
  console.log('listening to port 3978');
});

server.post('/api/messages', bot.getConnector().listen());

