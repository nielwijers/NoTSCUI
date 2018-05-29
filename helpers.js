/**
 * All bot standalone functions are implemented here.
 */

const fs = require('fs');
const builder = require('botbuilder');
const conclusions = require('./conclusions.json');

/**
 * Extention method of any Array type.
 * Checks if the array has an index of the given value.
 * @param {*} value
 * @returns {boolean}
 */
Array.prototype.has = function(value) {
    return this.indexOf(value) >= 0;
};

/**
 * Uses the recognizer to check if questions are answered.
 * Saves the anwered questions to a file in the /ConversationData folder.
 * @param {object} session
 * @param {object} intents
 * @param {function} cb
 */
let answerQuestionsWithEntities = (session, intents, cb) => {
    intents.recognize(session, (error, entities) => {
        if (error) cb({error});
        else {
            if (entities.intent !== 'Default Fallback Intent') {
                let characteristics = {type: entities.intent}

                for (let i = 0; i < entities.entities.length; i++) {
                    if (conclusions[entities.intent].entities.has(entities.entities[i].type)) {
                        characteristics[entities.entities[i].type] = entities.entities[i].entity;
                    }
                }

                saveConversationData(session, {characteristics: characteristics}, cb);
            }
            else {
                cb({error: 'IntentUnkown'})
            }
        }
    });
}

/**
 * Saves the given object to a new file. If the files already
 * excists, merge it in the excisting file.
 * @param {object} session
 * @param {object} conversationData
 * @param {function} cb
 */
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

/**
 * Returns the data object read from the user specific file.
 * @param {object} session
 * @returns {object}
 */
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

/**
 * Checks if the given entity of the user is already known.
 * @param {object} entity
 * @param {object} cData
 * @returns {boolean}
 */
let questionAnswered = (entity, cData) => {
    return Object.keys(cData.characteristics).has(entity)
        && cData.characteristics[entity] != null
        && cData.characteristics[entity] != '';
}

/**
 * Gets the advice from given type.
 * @param {string} type
 * @returns {string}
 */
let getAdvice = (intent, type) => {
    return conclusions[intent].types[type].Advies;
}

/**
 * Gives back 2 characteristics from the given possible conclusions.
 * @param {array} possibilities
 * @param {object} cData
 * @param {integer} index
 * @returns {array}
 */
let getCharacteristics = (possibilities, cData, index = 0) => {
    if (index >= possibilities.length - 1) {
        return [];
    }

    let characteristics = conclusions[cData.characteristics.type].types[possibilities[index].name].Kenmerken.slice();
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

    if (characteristics.length <= 0) {
        return getCharacteristics(possibilities, cData, index + 1);
    }

    return characteristics;
}

/**
 * Checks if the conclusion type has a variable intensity.
 * @param {string} type
 * @returns {boolean}
 */
let hasVariableIntensity = (intent, type) => {
    return Object.keys(getAdvice(intent, type)).length > 1;
}

/**
 * Gets all sorted possibilities by most corresponding with the symptoms.
 * @param {object} cData
 * @returns {object}
 */
let getConclusion = cData => {
    possibilities = [];
    let possibleConclusions = conclusions[cData.characteristics.type].types;

    for (let c = 0; c < Object.keys(possibleConclusions).length -1; c++) {
        possibilities[c] = {name: Object.keys(possibleConclusions)[c], score: 0}
        for (let s = 0; s < Object.keys(cData.characteristics).length; s++) {
            let sKey = Object.keys(cData.characteristics)[s];
            if (sKey != 'type') {
                if (cData.characteristics[sKey].constructor === Array) {
                    let characteristicsArray = cData.characteristics[sKey];
                    for (let a = 0; a < characteristicsArray.length; a++) {
                        if (possibleConclusions[possibilities[c].name][sKey].has(characteristicsArray[a])) {
                            possibilities[c].score += 1;
                        }
                    }
                } else {
                    if (cData.characteristics[sKey] != null && possibleConclusions[possibilities[c].name][sKey].has(cData.characteristics[sKey])) {
                        possibilities[c].score += 1;
                    }
                }
            }
        }
    }

    possibilities.sort((a,b) => (a.score < b.score) ? 1 : ((b.score > a.score) ? -1 : 0) );

    data = {
        possibilities: possibilities,
        final: possibilities[0].score - possibilities[1].score > 2,
        variableIntensity: hasVariableIntensity(cData.characteristics.type, possibilities[0].name)
    }

    return data;
}

/**
 * Delete the corresponding user file.
 * @param {object} session
 * @param {function} cb
 */
let deleteUserData = (session, cb) => {
    fs.readdir('./ConversationData', (error, files) => {
        if (files != undefined && session.message.address.conversation.id+'.json' in files) {
            fs.unlink('./ConversationData/'+session.message.address.conversation.id+'.json', error => {
                if (error) console.log(e);
                cb();
            });
        }
        else cb();
    });
}

let getGlobalQuestions = type => {
    return conclusions[type].characteristics.global;
}

let getIntensityQuestions = type => {
    return conclusions[type].characteristics.intensity;
}


/**
 * Exposes helpers.
 */
module.exports = {
    answerQuestionsWithEntities,
    getIntensityQuestions,
    hasVariableIntensity,
    saveConversationData,
    getConversationData,
    getGlobalQuestions,
    getCharacteristics,
    questionAnswered,
    deleteUserData,
    getConclusion,
    getAdvice,
}
