let answerQuestionsWithEntities = (session, intents) => {
    intents.recognize(session, (error, entities) => {
        if (error) return null;
        else {
            // TODO: In conversationdata opslaan.
            let entityObj = {
                PijnPunt: null,
                PijnSoort: null,
                Geslacht: null
            }
            let keys = Object.keys(entityObj);
            for (let i = 0; i < keys.length; i++) {
                entityObj[keys[i]] = builder.EntityRecognizer.findEntity(entities.entities, keys[i]).entity;
            }
        }
    });
}

module.exports = {
    answerQuestionsWithEntities,
}