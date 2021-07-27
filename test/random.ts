import CheweyBotAPI from "../src";
const apiKey = "f808a458-b9a8-4e54-84ef-2115c586e1ab";

const chewey = new CheweyBotAPI(apiKey);

void chewey.random().then(console.log);
