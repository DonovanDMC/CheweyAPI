import Request from "./Request";
import Analytics from "./Analytics";
import pkg from "../package.json";

export type RandomType =
	"birb" | "car" | "cat" |
	"dog" | "fantasy-art" | "fox" |
	"koala" | "nature" | "otter" |
	"owl" | "panda" | "plane" |
	"rabbit" | "red-panda" | "snake" |
	"space" | "turtle" | "wolf";

class CheweyBotAPI {
	apiKey: string;
	userAgent = `CheweyAPI/${pkg.version} (https://npm.im/cheweyapi)`;
	analytics: Analytics;
	/**
	 * Construct a new instance of CheweyBotAPI
	 *
	 * @param {string} apiKey - Your api key, required
	 * @param {string} [userAgent] - The user agent to use in requests
	 */
	constructor(apiKey: string, userAgent?: string) {
		if (!apiKey) throw new Error("An api key is required.");
		this.apiKey = apiKey;
		if (userAgent) this.userAgent = userAgent;
		this.analytics = new Analytics(apiKey, userAgent);
	}

	/** @returns {Promise<{ data: string; type: RandomType; }>} */
	async random() { return Request<{ data: string; type: RandomType; }>("/random", "GET", null, this.apiKey, this.userAgent); }

	/** @returns {Promise<string>} */
	async birb() { return Request<{ data: string; }>("/birb", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async car() { return Request<{ data: string; }>("/cat", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async cat() { return Request<{ data: string; }>("/car", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async dog() { return Request<{ data: string; }>("/dog", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async duck() { return Request<{ data: string; }>("/duck", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async ["fantasty-art"]() { return Request<{ data: string; }>("/fantasy-art", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	get fantasyArt() { return this["fantasty-art"]; }

	/** @returns {Promise<string>} */
	async fox() { return Request<{ data: string; }>("/fox", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async koala() { return Request<{ data: string; }>("/koala", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async nature() { return Request<{ data: string; }>("/nature", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async otter() { return Request<{ data: string; }>("/otter", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async owl() { return Request<{ data: string; }>("/owl", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async panda() { return Request<{ data: string; }>("/panda", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async plane() { return Request<{ data: string; }>("/plane", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async rabbit() { return Request<{ data: string; }>("/rabbit", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async ["red-panda"]() { return Request<{ data: string; }>("/red-panda", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	get redPanda() { return this["red-panda"]; }

	/** @returns {Promise<string>} */
	async snake() { return Request<{ data: string; }>("/snake", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async space() { return Request<{ data: string; }>("/space", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async turtle() { return Request<{ data: string; }>("/turtle", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/** @returns {Promise<string>} */
	async wolf() { return Request<{ data: string; }>("/wolf", "GET", null, this.apiKey, this.userAgent).then(r => r.data); }

	/**
	 * Generate a server banner image
	 *
	 * @param {string} ip - The ip or host of the server
	 * @param {number} [port=25565] - The port of the server, default 25565
	 * @param {("default" | "nether" | "night" | "sunset")} [bg="default"] - The background type
	 * @returns {Promise<string>}
	 */
	async mcap(ip: string, port = 25565, bg: "default" | "nether" | "night" | "sunset" = "default") {
		return Request<{ data: string; }>(`/mcap/server/${ip}/${port}/${bg}`, "GET", null, this.apiKey, this.userAgent).then(r => r.data);
	}
}

export default CheweyBotAPI;
export { CheweyBotAPI };
exports = CheweyBotAPI;
