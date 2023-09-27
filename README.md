# Chewey API
##### An api wrapper for https://api.chewey-bot.top, with full api coverage as of 09/27/2023.
######  Consult the api's [docs](https://api-docs.chewey-bot.top/) or [the source code](https://github.com/DonovanDMC/CheweyAPI) for endpoints.

### Basic Usage
```ts
// commonjs
const CheweyAPI = require("cheweyapi");
// typescript
import CheweyAPI from "cheweyapi";

// an api key is REQUIRED
const chewey = new CheweyAPI("apiKey");

// returns an image url
// all endpoints on https://api.chewey-bot.top are supported
const birb = await chewey.images.birb(); 

// returns an array of endpoint keys
const endpoints = await chewey.getEndpoints();

// returns a status banner for a minecraft server - with player counts
// ip, port (default: 25565), background (default, nether, night, sunset)
const mcBanner = await chewey.mcap("mc.hypixel.net", 25565, "default")
```

### Analytics Usage
```ts
// (same base as above)

// manual post
chewey.analytics.post({
    servers:           0,
    users:             0,
    channels:          0,
    sent_messages:     0,
    received_messages: 0,
    ram_used:          0
});

// or, use auto posting with Oceanic, Eris, or Discord.JS
chewey.analytics.initAutoPosting(client);

// if you want to specify more options
chewey.analytics.initAutoPosting({
    client, // required, everything else is optional
    interval: 6.1e5, // default is 610000, ratelimit is once per 10 minutes
    postOnStart: true, // default is true
    messages: true, // default is true, adds a listener for messageCreate to the provided client
    // if you collect memory usage elsewhere
    getMemoryUsage() {
        return process.memoryUsage().rss;
    }
});

// to stop
chewey.analytics.stopAutoPosting();
```
