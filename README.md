# Nots CUI prototype chatbot
## Inleiding (hoofdstuktitel verwijderen wanneer dit hoofdstuk af is)
ineiding
## Bijdrage bij de casus
Het doel van dit onderzoek is om de mogelijkheden te bepalen waarmee een CUI de ernst van een klacht kan classificeren en daarbij de huisarts kan assisteren.

Dit prototype is gebouwd om online beschikbaar te zijn, waardoor gebruikers ten allen tijden de chatbot kunnen benaderen. Bij het gebruik van de chatbot hebben de gebruikers de mogelijkheid om te vragen naar advies over een bepaalde klacht. De chatbot zal doormiddel van gerichte vragen te stellen een conclusie trekken en daarbij gericht advies terug geven.

Met het advies van de chatbot kan het aantal bezoekers bij de huisarts verminderen. Gebruikers kunnen sneller thuis blijven wanneer een vertrouwde chatbot verteld wat de beste manier is om de klachten te verhelpen.
## Gebruikte tools
### Microsoft bot framework
Hoe?
Waarom?
### NodeJs
Hoe?
Waarom?
### Dialogflow
Hoe?
Waarom?
## Werking
### Conclusies
De chatbot maakt dynamisch gebruik van een centraal bestand `conclusions.json` waar alle mogelijke conlusies in opgeslagen staan. Dit bestand bestaat uit de type conclusies, conclusies, symptomen, adviezen en entities. Wanneer er een conclusie wordt toegevoegd aan het bestand moet DialogFlow worden aangevult met de informatie die is toegevoegd.

De toegevoegde entities bestaan uit alle symptomen van de types. De characteristics moeten gevult worden met het tweetal set aan objecten: global en intensity. Onder global zullen de vragen en antwoorden gezet worden welke in de standaard vragenset zitten. De intensity array moet gevult worden met de vragen en antwoorden die achter de intensiteit moeten komen van de conclusie. De naam zal exact dezelfde naam bevatten als de entities. Wanneer er meerdere antwoorden worden meegegeven aan een vraag moeten deze met gescheiden worden met een sluisteken (`|`). Bijvoorbeeld:
```json
{
    "name": "PijnSoort",
    "question": "Welk van de volgende pijnsoorten komt het meeste overeen met uw hoofdpijn?",
    "answers": "Drukkend|Dof|Snijdend|Bonzend|Kloppend|Zeurend"
}
```

De entities moeten per stuk worden toegevoegd aan de set entities in DialogFlow onder de intent met de naam van de conlusie type. Hieronder een voorbeeld van het type 'Hoofdpijn'.
```json
 "entities": [
    "Geslacht",
    "PijnZijde",
    "PijnPunt",
    "PijnSoort",
    "Hevigheid",
    "Aanwezigheid"
]
```


- Hoe voeg je conclusies toe?
- Hoe voeg je dialogs toe?
- Hoe voeg je functies toe?
## Installatie

1. Clone of download de repository van [Github](https://github.com/nielwijers/NoTSCUI.git).
2. Installeer de Node packages door het volgende commando in uw terminal uit te voeren:
```
npm install
```
3. Download en installeer de [Microsoft Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases)
4. Om de bot te starten moet het volgende commando worden uitgevoerd:
```
npm start diagnosebot
```
7. Open de Microsoft Bot Framework Emulator.
8. Vul de volgende 'Endpoint URL' in: http://localhost:3978/api/messages
   - 'App ID', 'App Password' en 'Locale' velden hoeven niet ingevuld te worden
9. Druk op verbinden.
