# Adapters for various client platforms on the Narratory chatbot platform

Narratory is a platform-independent tool to build chatbots. This repo consists of supported adapters to make sure to render output in the right way for different platforms - for example how to render a **Card** rich component Facebook messenger.

Each adapter is a function getting an array of `RichSaySingleText` messages, essentially Narratory's RichSay but with with random selection of strings already being executed. I.e, if a botTurn is `{ say: ["hi there", "hello"] }` the messages the adapter receives will be either "hi there" or "hello". 

The response has to be an object compatible with the Dialogflow webhook response format for the given client type.

Currently supported clients: 
* Facebook Messenger
* Kommunicate
* Slack
* Voximplant
* Google Assistant (not part of this repository due to it's complexity)
* General/unknown client (used when platform is not assigned or matching any of the above platforms)

