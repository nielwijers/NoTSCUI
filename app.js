const NO_BOT_ERROR = 'Please provide name of the bot you want to start. (npm start *botname*)';
const UNKNOWN_BOT_ERROR = 'Bot not found.';
const BOTNAME = process.argv[2];

var express = require('express');
var Bot;

if (typeof(BOTNAME) == 'undefined') {
  throw new Error(NO_BOT_ERROR);
}

try {
  Bot = require('./Bots/' + BOTNAME + '.js');
} catch (e) {
  throw new Error(UNKNOWN_BOT_ERROR);
}

var server = express();

const bot = new Bot.Bot();
bot.init();

process.argv[2]

server.listen(3978, function () {
  console.log('listening to port 3978');
});

server.post('/api/messages', bot.getConnector().listen());
