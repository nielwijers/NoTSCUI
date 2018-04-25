const builder = require('botbuilder');
const apiairecognizer = require('api-ai-recognizer');
const fs = require('fs');

const FALLBACK_ANSWER = "Sorry ik heb het niet helemaal begrepen."

/* This is the default template to build a chatbot with*/
class Bot {
    constructor() {
        this.connector = new builder.ChatConnector({
            appId: process.env.MicrosoftAppId,
            appPassword: process.env.MicrosoftAppPassword
        });

        this.bot = new builder.UniversalBot(this.connector);
    }

    getConnector() {
        return this.connector
    }

    init() {
        this.bot.dialog('/', [
          function (session) {
            session.send("Wekom bij de demo van de rich cards!")
            builder.Prompts.choice(session, "Kies een card", "AdaptiveCard|AnimationCard|AudioCard|HeroCard|ThumbnailCard|ReceiptCard|SignInCard|VideoCard", { listStyle: builder.ListStyle.button });
          },
          function (session, results) {
            session.beginDialog(results.response.entity);
          },
          function (session, results) {
            session.send("Dit was de demo. Fijn weekend.");
            session.endDialog();
          }
        ]);

        this.bot.dialog("AdaptiveCard", [
          function (session) {
            session.send("Welkom bij de AdaptiveCard");
            session.send({
              text: "Dit is een voorbeeld van een adaptive card:",
              attachments: [{
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                  type: "AdaptiveCard",
                  version: "1.0",
                  body: [{
                    type: "TextBlock",
                    text: "Ik ben een adaptive card!",
                    size: "large"
                  },
                  {
                    type: "TextBlock",
                    text: "_Ik kan vanalles bevatten:_"
                  },
                  {
                    type: "TextBlock",
                    text: "Tekst, spraak,",
                    separation: "none"
                  },
                  {
                    type: "TextBlock",
                    text: "afbeeldingen, knoppen",
                    separation: "none"
                  },
                  {
                    type: "TextBlock",
                    text: "en invoervelden",
                    separation: "none"
                  }],
                  actions: [{
                    type: "Action.OpenUrl",
                    url: "https://docs.microsoft.com/en-us/adaptive-cards/get-started/bots",
                    title: "Meer weten?"
                  }
                ]}
              }]
            });
            session.send({
              text: "Het is ook mogelijk om meerdere cards te sturen:",
              attachments: [{
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                  type: "AdaptiveCard",
                  version: "1.0",
                  body: [{
                    type: "TextBlock",
                    text: "Ik ben de eerste!",
                    size: "large"
                  }],
                  actions: [{
                    type: "Action.OpenUrl",
                    url: "http://www.dumpert.nl/mediabase/7308681/ca2599c8/ik_ben_de_eerste_.html",
                    title: "De eerste?"
                  }
                ]}
              },
              {
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                  type: "AdaptiveCard",
                  version: "1.0",
                  body: [{
                    type: "TextBlock",
                    text: "Nog één!",
                    size: "large"
                  }],
                  actions: [{
                    type: "Action.OpenUrl",
                    url: "https://www.youtube.com/watch?v=jEI3N9kIyP4",
                    title: "Nog één?"
                  }]
                }
              }]
            });
            session.endDialog();
          }
        ]);

        this.bot.dialog("AnimationCard", [
          function (session) {
            session.send("Welkom bij de AnimationCard");
            session.send({
              text: "Dit is een voorbeeld van een animation card:",
              attachments: [{
                contentType: "application/vnd.microsoft.card.animation",
                content: {
                  type: "AnimationCard",
                  version: "1.0",
                  media: [
                    { url: "https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif" }
                  ],
                  text: "Deze card speelt gifjes of korte filmpjes"
                }
              }]
            });
            session.endDialog();
          }
        ]);

        this.bot.dialog("AudioCard", [
          function (session) {
            session.send("Welkom bij de AudioCard");
            session.send({
              text: "Dit is een voorbeeld van een audio card:",
              attachments: [{
                contentType: "application/vnd.microsoft.card.audio",
                content: {
                  type: "AudioCard",
                  version: "1.0",
                  media: [
                    { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
                  ],
                  text: "Deze card speelt muziek af"
                }
              }]
            });
            session.endDialog();
          }
        ]);

        this.bot.dialog("HeroCard", [
          function (session) {
            session.send("Welkom bij de HeroCard");
            session.send({
              text: "Dit is een voorbeeld van een hero card:",
              attachments: [{
                contentType: "application/vnd.microsoft.card.hero",
                content: {
                  type: "HeroCard",
                  version: "1.0",
                  title: "Ik ben een Hero card!",
                  subtitle: "Ik bevat meestal één grote afbeelding, wat knoppen en tekst",
                  images: [{
                    url: "https://ia.media-imdb.com/images/M/MV5BMTUzMDM4Nzk2MV5BMl5BanBnXkFtZTcwNTcwNjExOQ@@._V1_UY317_CR1,0,214,317_AL_.jpg"
                  }],
                  buttons: [{
                    type: "openUrl",
                    value: "https://www.imdb.com/name/nm0000115/",
                    title: "Wie is dit?"
                  }]
                }
              }]
            });
            session.endDialog();
          }
        ]);

        this.bot.dialog("ThumbnailCard", [
          function (session) {
            session.send("Welkom bij de ThumbnailCard");
            session.send({
              text: "Dit is een voorbeeld van een thumbnail card:",
              attachments: [{
                contentType: "application/vnd.microsoft.card.thumbnail",
                content: {
                  type: "ThumbnailCard",
                  version: "1.0",
                  title: "Thumbnail!",
                  images: [{
                    url: "https://i.ytimg.com/vi/1qJZY8TPodc/hqdefault.jpg?sqp=-oaymwEXCPYBEIoBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCTttBpWMVYIljZHawLvmqn5ixIhg"
                  }],
                  buttons: [{
                    type: "openUrl",
                    value: "https://www.reddit.com/r/PrequelMemes/",
                    title: "Meer informatie"
                  }]
                }
              }]
            });
            session.endDialog();
          }
        ]);

        this.bot.dialog("ReceiptCard", [
          function (session) {
            session.send("Welkom bij de ReceiptCard");
            session.send({
              text: "Dit is een voorbeeld van een receipt card:",
              attachments: [{
                contentType: "application/vnd.microsoft.card.receipt",
                content: {
                  type: "ReceiptCard",
                  version: "1.0",
                  title: "Bonnetje",
                  facts: [{
                    key: "Medewerker:",
                    value: "Kim"
                  },
                  {
                    key: "Winkel:",
                    value: "Jumbo"
                  }],
                  items: [{
                    price: "€1",
                    quantity: "2",
                    title: "Bananen"
                  },
                  {
                    price: "€0.55",
                    quantity: "24",
                    title: "Coca Cola"
                  }],
                  total: "€1.55"
                }
              }]
            });
            session.endDialog();
          }
        ]);

        this.bot.dialog("SignInCard", [
          function (session) {
            session.send("Welkom bij de SignInCard");
            session.send({
              text: "Dit is een voorbeeld van een signin card:",
              attachments: [{
                contentType: "application/vnd.microsoft.card.signin",
                content: {
                  type: "SignInCard",
                  version: "1.0",
                  text: "Log aub in:",
                  buttons: [{
                    type: "openUrl",
                    value: "https://myaccount.google.com/?pli=1",
                    title: "Inloggen"
                  }]
                }
              }]
            });
            session.endDialog();
          }
        ]);

        this.bot.dialog("VideoCard", [
          function (session) {
            session.send("Welkom bij de VideoCard");
            session.send({
              text: "Dit is een voorbeeld van een video card:",
              attachments: [{
                contentType: "application/vnd.microsoft.card.video",
                content: {
                  type: "VideoCard",
                  version: "1.0",
                  text: "Dit is een video card!",
                  media: [{
                    url: "https://www.youtube.com/watch?v=d5d02U5YYfk",
                  }]
                }
              }]
            });
            session.endDialog();
          }
        ]);
    }
}

module.exports.Bot = Bot;
