const builder = require('botbuilder');
const helpers = require('../helpers');

let data;

//TODO: remove after helpers
data = {
    advice: 'Neem driemaaldaags een paracetamol voor een week.',
    conclusion: 'Migraine'
}

module.exports = function (intents) {
    return {
        name: "AdviceDialog",
        steps: [
            (session, args) => {
                //TODO: get data from helpers

                session.send('Het lijkt erop dat u ' + data.conclusion + ' heeft. \n Het advies hiervoor is: \n ' + data.advice);
                session.send('Mijn werk zit er weer op, fijne dag verder!');
            }
        ]
    }
}
