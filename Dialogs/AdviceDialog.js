const builder = require('botbuilder');
const helpers = require('../helpers');

let cData;

module.exports = function (intents) {
    return {
        name: "AdviceDialog",
        steps: [
            (session, args) => {
                cData = args;

                let conclusion = helpers.getConslusion(cData);
                let advice = helpers.getAdvice(conclusion.possibilities[0].name);

                if (helpers.questionAnswered('Hevigheid', cData)) {
                    let hevigheid = cData.characteristics.Hevigheid;
                    if (hevigheid > 2) {
                        advice = advice.Ernstig;
                    } else {
                        advice = advice.Matig;
                    }
                } else {
                    advice = advice.Matig;
                }

                session.send('Het lijkt erop dat u ' + conclusion.possibilities[0].name + ' heeft. \n Het advies hiervoor is: \n ' + advice);
                session.send('Mijn werk zit er weer op, fijne dag verder!');
            }
        ]
    }
}
