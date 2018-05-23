const fs = require('fs');
const builder = require('botbuilder');
const conclusions = require('./conclusions.json');

Array.prototype.has = function(value) {
    return this.indexOf(value) >= 0;
};

let answerQuestionsWithEntities = (session, intents, cb) => {
    intents.recognize(session, (error, entities) => {
        if (error) return null;
        else {
            let characteristics = {}

            for (let i = 0; i < entities.entities.length; i++) {
                if (conclusions.entities.has(entities.entities[i].type)) {
                    characteristics[entities.entities[i].type] = entities.entities[i].entity;
                }
            }
            console.log(characteristics);
            saveConversationData(session, {characteristics: characteristics}, cb);
        }
    });
}

let saveConversationData = (session, conversationData, cb) => {
    fs.readdir('./ConversationData', (error, files) => {
        let cData = conversationData;
        if (files != undefined && session.message.address.conversation.id+'.json' in files) {
            fs.readFile('./ConversationData/'+session.message.address.conversation.id+'.json', (error, content) => {
                try {
                    let data = JSON.parse(content);
                    let cData = Object.assign(data, converationData)
                    fs.writeFile('./ConversationData/'+session.message.address.conversation.id+'.json',
                    JSON.stringify(merged), 'utf8', (error) => {
                        if (error) {
                            console.log(error);
                        }
                        cb(cData);
                    })
                }
                catch(e) {
                    console.log(e);
                    cb(cData);
                }
            });
        }
        else {
            fs.writeFile('./ConversationData/'+session.message.address.conversation.id+'.json',
                JSON.stringify(conversationData), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
                cb(cData);
            });
        }
    });
}

let getConversationData = (session) => {
    let files = fs.readdirSync('./ConversationData', 'utf8');
    if (files != undefined && session.message.address.conversation.id+'.json' in files) {
        let content = fs.readFileSync('./ConversationData/'+session.message.address.conversation.id+'.json', 'utf8');
        try {
            return JSON.parse(content);
        }
        catch(e) {
            console.log(e);
            return null;
        }
    }
    return null;
}

let questionAnswered = (entity, cData) => {
    return Object.keys(cData.characteristics).has(entity)
        && cData.characteristics[entity] != null
        && cData.characteristics[entity] != '';
}

let getAdvice = type => {
    return conclusions[type].Advies;
}

let getCharacteristics = type => {
    return conclusions[type].Kenmerken;
}

let getConslusion = cData => {
    possibilities = [];


    for (let c = 0; c < Object.keys(conclusions).length -1; c++) {
        possibilities[c] = {name: Object.keys(conclusions)[c], score: 0}
        for (let s = 0; s < Object.keys(cData.characteristics).length; s++) {
            let sKey = Object.keys(cData.characteristics)[s];
            if (conclusions[possibilities[c].name][sKey] == undefined) {
                console.log(possibilities[c].name, sKey);
            }
            if (cData.characteristics[sKey] != null && conclusions[possibilities[c].name][sKey].has(cData.characteristics[sKey])) {
                possibilities[c].score += 1;
            }
        }
    }

    possibilities.sort((a,b) => (a.score < b.score) ? 1 : ((b.score > a.score) ? -1 : 0) );

    let vi = Object.keys(getAdvice(possibilities[0].name)).length > 1;

    conclusion = {
        type: possibilities[0].name,
        final: possibilities[0] - possibilities[1] > 2,
        variableIntensity: vi
    }

    return conclusion;
}

module.exports = {
    answerQuestionsWithEntities,
    saveConversationData,
    getConversationData,
    getCharacteristics,
    questionAnswered,
    getConslusion,
    getAdvice,
}
