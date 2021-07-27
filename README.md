# Chewey Bot API
##### An api wrapper for https://api.chewey-bot.top, with full api coverage as of 07/27/2021.
######  Consult the api's [docs](https://api-docs.chewey-bot.top/) or [the source code](https://github.com/DonovanDMC/CheweyBotAPI) for endpoints.

### Basic Usage
```ts
// commonjs
const CheweyBotAPI = require("cheweybotapi");
// typescript
import CheweyBotAPI from "cheweybotapi";

// an api key is REQUIRED
const chewey = new CheweyBotAPI("apiKey");

// returns an image url
const birb = await chewey.birb(); 
```

### Analytics Usage
```ts
// (same base as above)

// manual post
// servers, users, channels, sent_messages, received_messages, ram_used
chewey.analytics.post(0, 0, 0, 0, 0, 0);

// or, use auto posting with Eris or Discord.JS
chewey.analytics.initAutoPosting(client);

// to stop
chewey.analytics.stopAutoPosting();
```
