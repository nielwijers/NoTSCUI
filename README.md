# Clara de chatbot
Clara is het prototype dat tijdens het NoTS onderzoek naar Conversational User Interfaces is gebouwd. Het prototype laat zien hoe een NLP tool gebruikt kan worden in een chatbot. Ook laat het zien hoe met een decision graph een conversatie gemaakt wordt.

Deze chatbot is dynamisch opgezet en kan daarom makkelijk uitgebreid worden. Onder het kopje 'Werking' is te zien hoe Clara uitgebreid wordt.
## Bijdrage bij de casus
Het doel van dit onderzoek is om de mogelijkheden te bepalen waarmee een CUI de ernst van een klacht kan classificeren en daarbij de huisarts kan assisteren.

Dit prototype is gebouwd om online beschikbaar te zijn, waardoor gebruikers ten allen tijde de chatbot kunnen benaderen. Bij het gebruik van de chatbot hebben de gebruikers de mogelijkheid om te vragen naar advies over een bepaalde klacht. De chatbot zal doormiddel van gerichte vragen te stellen een conclusie trekken en daarbij gericht advies geven.

Met het advies van de chatbot kan het aantal bezoekers bij de huisarts verminderen. Gebruikers kunnen sneller thuis blijven wanneer een vertrouwde chatbot vertelt wat de beste manier is om de klachten te verhelpen.
## Gebruikte tools
De gebruikte tools voor dit prototype zijn met een reden gekozen. In deze paragraaf staat per tool aangegeven waarom hiervoor gekozen is en hoe dit is toegepast.
### NodeJs
Om tijdens het maken van het prototype alle focus te kunnen leggen op het maken van een chatbot is gekozen om een bij het projectteam bekende programmeertaal te gebruiken. Dit moest C#, PHP, Java of JavaScript zijn. Mede dankzij de keuze voor het Microsoft bot framework is gekozen om met NodeJs te werken. Dit is een JavaScript runtime die bekend is bij het projectteam. Het Microsoft bot framework werkt ook in C#, hier is niet voor gekozen omdat C# minder bekend is bij het projectteam en dus meer tijd zou kosten om eigen te maken.

NodeJs wordt als fundament van de chatbot gebruikt. Ook is met Express van NodeJs de API gemaakt.
### Microsoft bot framework (MSBF)
In het onderzoek is gekeken naar een groot aantal tools om een chatbot mee te bouwen. Hiervoor is criteria opgesteld, bijvoorbeeld dat de tool gratis moet zijn en een actieve community heeft. Hier zijn het MSBF en Hubot doorheen gekomen. Omdat het MSBF een grote hoeveelheid functionaliteiten biedt die Hubot niet biedt is gekozen om het MSBF te gebruiken.

Met het MSBF zijn alle dialogen opgebouwd. De flow van de chatbot wordt hiermee in stand gehouden. Daarnaast worden de berichten van de chatbot versterkt met de mogelijkheid om antwoorden te selecteren. Dit is ook een onderdeel van het MSBF. Het MSBF maakt gebruik van 'recognizers' om een koppeling te maken met een NLP tool. In dit geval is de apiairecognizer gebruikt om de chatbot met Dialogflow te koppelen.
### Dialogflow
Net als bij het MSBF is gekeken naar een grote hoeveelheid tools voor NLP. Na criteria aan deze tools te hebben gesteld zijn hier Dialogflow en Wit.Ai uit gekomen. De reden dat niet gekozen is voor Wit.Ai is omdat de uitkomst van het ontleden van zinnen anders is dan het MSBF verwacht. Dialogflow sloot wel goed aan op het MSBF.

Met de eerder genoemde apiairecognizer wordt op één moment een bericht gestuurd naar Dialogflow. Met de intentie van Dialogflow wordt gekozen welke vragen gesteld worden en worden deze vragen overgeslagen indien de entiteit daarvoor al in de zin voorkomt.  
## Werking
### Conclusies
De chatbot maakt dynamisch gebruik van een centraal bestand `conclusions.json` waar alle mogelijke conlusies in opgeslagen staan. Dit bestand bestaat uit de type conclusies, conclusies, symptomen, adviezen en entities. Wanneer er een conclusie wordt toegevoegd aan het bestand moet DialogFlow worden aangevult met de informatie die is toegevoegd. Eenmaal dit toegevoegd, hoeft er aan de bot verder niks veranderd te worden.

De toegevoegde entities bestaan uit alle symptomen van de types die in `conclusions.json` gebruikt worden. De characteristics moeten gevult worden met het tweetal set aan objecten: global en intensity. Onder global zullen de vragen en antwoorden gezet worden welke in de standaard vragenset zitten. De intensity array moet gevult worden met de vragen en antwoorden die achter de intensiteit moeten komen van de conclusie. De naam moet exact hetzijlfde zijn als de naam van de entities. Wanneer er meerdere antwoorden worden meegegeven aan een vraag moeten deze met gescheiden worden met een sluisteken (`|`). Bijvoorbeeld:
```json
{
    "name": "PijnSoort",
    "question": "Welk van de volgende pijnsoorten komt het meeste overeen met uw hoofdpijn?",
    "answers": "Drukkend|Dof|Snijdend|Bonzend|Kloppend|Zeurend"
}
```

De entities moeten per stuk worden toegevoegd aan de set entities in DialogFlow onder de intent met de naam van de conlusie type. Hieronder een voorbeeld van het type 'Hoofdpijn'.
```json
{
    "entities": [
        "Geslacht",
        "PijnZijde",
        "PijnPunt",
        "PijnSoort",
        "Hevigheid",
        "Aanwezigheid"
    ]
}
```
![dialogflow entities](/images/dialogflowEntities.png)
### Dialogs
Dialogs worden dynamisch aangemaakt door alle files in de folder `./Dialogs`. Wanneer er een nieuwe dialog is aangemaakt in deze map, zal de dialog geinstantieerd worden bij het starten van de bot. De dialogs moeten echter nog wel apart worden aangeroepen. Elke dialog zal de volgende structuur moeten bevatten:
```js
module.exports = function (intents) {
    return {
        name: "dialognaam",
        steps: [
            (session, args, next) => {
                // Stap 1.
            },
            (session, args, next) => {
                // Stap 2..
            },
            // Etc ...
        ]
    }
}
```
### Helper functies
Alle functionaliteiten wat niet chatbot gerelateerd is, zijn in de `helpers.js` file geplaatst. De helper functies kunnen op de volgende manier gebruikt worden:
```js
const helpers = require('../helpers');
let advice = helpers.getAdvice();
```
De helpers file kan worden uitgebreid met functies door een function toe te voegen en onderaan de function mee te geven aan de export:
```js
let nieuweFunctieNaam = parameter => {
    return parameter
}

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
    // nieuweFunctieNaam,
}
```
## Installatie

1. Clone of download de repository van [Github](https://github.com/nielwijers/NoTSCUI.git).
2. Navigeer binnen de Commandline of Terminal naar de project map.
2. Installeer de Node packages door het volgende commando in uw Commandline of Terminal uit te voeren:
```
npm install
```
3. Download en installeer de [Microsoft Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases)
4. Om de bot te starten moet het volgende commando worden uitgevoerd in uw Commandline of Terminal:
```
npm start diagnoseBot
```
7. Open de Microsoft Bot Framework Emulator.
8. Vul de volgende 'Endpoint URL' in: http://localhost:3978/api/messages
   - 'App ID', 'App Password' en 'Locale' velden hoeven niet ingevuld te worden
9. Druk op verbinden.
