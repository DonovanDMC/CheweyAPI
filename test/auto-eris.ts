import CheweyBotAPI from "../src";
import Eris from "eris";
const token = "";
const apiKey = "";

const client = new Eris.Client(`Bot ${token}`);
const chewey = new CheweyBotAPI(apiKey);
chewey.analytics.initAutoPosting(client);
client.connect();
