import CheweyBotAPI from "../src";
import DiscordJS from "discord.js";
const token = "";
const apiKey = "";

const client = new DiscordJS.Client();
const chewey = new CheweyBotAPI(apiKey);
chewey.analytics.initAutoPosting(client);
client.login(token);
