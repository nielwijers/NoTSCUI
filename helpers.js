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

let getCharacteristics = (possibilities, cData, index = 0) => {
    if (index >= possibilities.length - 1) {
        return null;
    }
    let characteristics = conclusions[possibilities[index].name].Kenmerken.slice();
    let indexesToRemove = [];
    if (cData.characteristics.Kenmerken != undefined) {
        for (let i = 0; i < characteristics.length; i++) {
            if (cData.characteristics.Kenmerken.has(characteristics[i]) || cData.askedCharacteristics.has(characteristics[i])) {
                indexesToRemove.push(i);
            }
        }
        for (let i = indexesToRemove.length-1; i > -1; i--) {
            characteristics.splice(indexesToRemove[i], 1);
        }
    }

    if (characteristics.length < 1) {
        getCharacteristics(possibilities, cData, index + 1);
    }

    return characteristics;
}

let hasVariableIntensity = type => {
    return Object.keys(getAdvice(type)).length > 1;
}

let getConslusion = cData => {
    possibilities = [];

    console.log(cData);

    for (let c = 0; c < Object.keys(conclusions).length -1; c++) {
        possibilities[c] = {name: Object.keys(conclusions)[c], score: 0}
        for (let s = 0; s < Object.keys(cData.characteristics).length; s++) {
            let sKey = Object.keys(cData.characteristics)[s];

            if (cData.characteristics[sKey].constructor === Array) {
                let characteristicsArray = cData.characteristics[sKey];
                for (let a = 0; a < characteristicsArray.length; a++) {
                    if (conclusions[possibilities[c].name][sKey].has(characteristicsArray[a])) {
                        possibilities[c].score += 1;
                    }
                }
            } else {
                if (cData.characteristics[sKey] != null && conclusions[possibilities[c].name][sKey].has(cData.characteristics[sKey])) {
                    possibilities[c].score += 1;
                }
            }
        }
    }

    possibilities.sort((a,b) => (a.score < b.score) ? 1 : ((b.score > a.score) ? -1 : 0) );

    data = {
        possibilities: possibilities,
        final: possibilities[0].score - possibilities[1].score > 2,
    }

    console.log(data);

    return data;
}

module.exports = {
    answerQuestionsWithEntities,
    hasVariableIntensity,
    saveConversationData,
    getConversationData,
    getCharacteristics,
    questionAnswered,
    getConslusion,
    getAdvice,
}
