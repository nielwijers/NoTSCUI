const builder = require('botbuilder');
const apiairecognizer = require('api-ai-recognizer');
const graphdialog = require('bot-graph-dialog');
const fs = require('fs');
const path = require('path');

const scenariosPath = path.join(__dirname.replace('/Bots', ''), 'scenarios');

const FALLBACK_ANSWER = "Sorry, Ik heb het niet begrepen.";

/* This is the an example with a decision graph*/
class Bot {
  constructor() {
    this.connector = new builder.ChatConnector({
      appId: process.env.MicrosoftAppId,
      appPassword: process.env.MicrosoftAppPassword
    });

    this.bot = new builder.UniversalBot(this.connector);

    this.intents = new builder.IntentDialog({
      recognizers: [new apiairecognizer("54ae2c103dcd42b5b65c4d4cd120ed25")]
    });
  }

  getConnector() {
    return this.connector
  }

  init() {
    this.bot.dialog('/', this.intents);

    this.loadAllDialogs();

    this.intents.onDefault(session => {
      session.send(FALLBACK_ANSWER);
    });
  }

  async loadAllDialogs() {
    let dialogs = await this.loadDialogs();

    dialogs.forEach(async dialog => {
      console.log(`loading scenario: ${dialog.scenario}`);

      this.intents.matches(dialog.intent, [
        function (session, args) {
          console.log(args);
          session.beginDialog(dialog.path, {});
        }
      ]);

      let graphDialog;

      try {
        let bot = this.bot;
        let loadScenario = this.loadScenario;

        graphDialog = await graphdialog.create({
          bot,
          scenario: dialog.scenario,
          loadScenario
        });
      }
      catch(err) {
        console.error(`error loading dialog: ${err.message}`);
      }

      this.bot.dialog(dialog.path, graphDialog.getDialog());

      console.log(`graph dialog loaded successfully: scenario ${dialog.scenario} for intent: ${dialog.intent}`);

    });
  }

  loadScenario(scenario) {
    return new Promise((resolve, reject) => {
      console.log('basePath:', scenariosPath);
      console.log('file:', scenario);

      let scenarioPath = path.join(scenariosPath, scenario + '.json');

      return fs.readFile(scenarioPath, 'utf8', (err, content) => {

        if (err) {
          console.error("error loading json: " + scenarioPath);
          return reject(err);
        }

        //TODO: somewhere here I'm getting an error!!!!
        var scenarioObj = JSON.parse(content);

        console.log('resolving scenario', scenarioPath);
        resolve(scenarioObj);
      });
    });
  }

  loadDialogs() {
    return new Promise((resolve, reject) => {
      console.log('loading dialogs');

      var dialogsPath = path.join(scenariosPath, "dialogs.json");
      return fs.readFile(dialogsPath, 'utf8', (err, content) => {

        if (err) {
          console.error("error loading json: " + dialogsPath);
          return reject(err);
        }

        var dialogs = JSON.parse(content);

        console.log('resolving dialogs', dialogsPath);
        resolve(dialogs.dialogs);
      });
    });
  }
}

module.exports.Bot = Bot;
