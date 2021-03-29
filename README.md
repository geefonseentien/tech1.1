# Apres ski Matching-application

![Apres ski](https://user-images.githubusercontent.com/15923433/107362901-aeeac100-6ad9-11eb-9e5b-a44d2ba61b38.jpg "Apres ski")<br>
Bron: cn traveler. (z.d.). Apres ski [Foto]. cntraveler.com. https://www.cntraveler.com/story/an-international-guide-to-the-world-of-apres-ski<br>

Een applicatie voor het samenbrengen van mensen op wintersport, die gezamenlijk de apres ski in kunnen duiken. Wintersporters kunnen door middel van deze app elkaar liken en contact met elkaar opnemen. De app is gemaakt voor mobiel.

## Table of content

- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Questions](#questions)
- [Live versions](#live-version-met-Digital-Ocean)
- [Documentation](#documentation)
- [Licence](#license)
- [Bronnen](#bronnen)

## Getting started

Om de applicatie werkend te krijgen dienen hier een aantal stappen uitgevoerd te worden.

### Installation

1. Clone deze repo

```Git clone https://github.com/geefonseentien/tech1.1.git```

2. Navigeer naar de hoofdmap van de Matching-application

```cd Matching-application/```

3. Plaats de .env folder in de root (hoofdmap) van de Matching-application en voeg er de volgende environment variabelen aan toe:
  - MONGODB_URL = voeg hier de url toe van uw MongoDB database
  - DB_NAME = voeg hier de naam toe van uw MongoDB database
  - SESSION_SECRET = voeg hier een secret key aan toe, deze kan het best bestaan uit verschillende cijfers en letters door elkaar, zodat het niet eenvoudig geraden kan worden.
  - SESSION_NAME = geef een naam mee aan de session
  - SESSION_LIFETIME = 1000 * 60 * 60 * 2
  - 
Om de Google api te gebruiken heb je een aantal tokens nodig. Deze kan je aanmaken op https://console.cloud.google.com/apis/dashboard.
  - CLIENT_ID = Deze krijg je wanneer je een nieuw project hebt aangemaakt met de google api
  - CLIENT_SECRET = Deze krijg je wanneer je een nieuw project hebt aangemaakt met de google api
  - REDIRECT_URI = https://developers.google.com/oauthplayground
  - REFRESH_TOKEN = op https://developers.google.com/oauthplayground kan je een refresh token genereren met jouw Client id en Client secret.


4. Installeer de NPM-packages

```npm install```

5. Start de Matching-application

```npm run start```

### Usage

De Matching-application draait op localhost:2997, voer deze in in de adres-balk van uw browser.

## Questions

Voor eventuele vragen over installatie of andere zaken neem contact op met een van de **Authors** via jellekitz@gmail.com, lotte.koblens@hva.nl, christiaan.zandbergen@hva.nl, zara.schriever@hva.nl, sam.boot@hva.nl.

## Live version met Digital Ocean
https://matchingapplication-8vspe.ondigitalocean.app/

## Documentation

Voor meer informatie over de vooruitgang van dit project bekijk onze [wiki](https://github.com/geefonseentien/tech1.1/wiki).

## License

De Matching-application maakt gebruik van een MIT license, voor meer informatie bekijk de [License](https://github.com/geefonseentien/tech1.1/blob/main/LICENSE).

## Bronnen

- markdownguide.org. (z.d.). Basic Syntax | Markdown Guide. Geraadpleegd op 7 maart 2021, van https://www.markdownguide.org/basic-syntax/

- Express. (z.d.). Express routing. expressjs.com. Geraadpleegd op 7 maart 2021, van https://expressjs.com/en/guide/routing.html

- NPM. (2020, 31 oktober). npm: node-sass. npmjs.com. https://www.npmjs.com/package/node-sass

- EJS. (z.d.). EJS -- Embedded JavaScript templates. ejs.co. Geraadpleegd op 7 maart 2021, van https://ejs.co/#install

- Academind. (2016a, maart 31). Node.js + Express - Tutorial - Insert and Get Data with MongoDB. YouTube. https://www.youtube.com/watch?v=ZKwrOXl5TDI

- Academind. (2016b, april 5). Node.js + Express - Tutorial - Update and Delete Data with MongoDB. YouTube. https://www.youtube.com/watch?v=-JcgwLIh0Z4&t=56s

- mongoDB. (z.d.). MongoDB Node Driver — Node.js. mongodb.com. Geraadpleegd op 7 maart 2021, van https://docs.mongodb.com/drivers/node/

- mongoDB. (z.d.). Db.collection.aggregate() — MongoDB Manual. Geraadpleegd van https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/

- mongoDB. (z.d.-a). $match (aggregation) — MongoDB Manual. Geraadpleegd van https://docs.mongodb.com/manual/reference/operator/aggregation/match/

- & Lesstof en informatie opgedaan door student assistenten.
