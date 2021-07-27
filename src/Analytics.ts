import Request from "./Request";
import pkg from "../package.json";
import { EventEmitter } from "stream";

export type BotAnalytics = Record<"servers" | "users" | "channels" | "sent_messages" | "received_messages" | "ram_used", number> & { created: string; };
export default class CheweyBotAPIAnalytics {
	apiKey: string;
	userAgent = `CheweyAPI/${pkg.version} (https://npm.im/cheweyapi)`;
	private interval: NodeJS.Timeout | undefined;
	private sentMessages = 0;
	private receivedMessages = 0;
	private client: GenericClient;
	private clientType: "discord.js" | "eris";
	constructor(apiKey: string, userAgent?: string) {
		if (!apiKey) throw new Error("An api key is required.");
		this.apiKey = apiKey;
		if (userAgent) this.userAgent = userAgent;
	}

	/**
	 * Manually post your analytics
	 *
	 * @param {number} servers - Your server count
	 * @param {number} users - Your user count
	 * @param {number} channels - Your channel count
	 * @param {number} sent_messages - Your sent messages count
	 * @param {number} received_messages - Your Received messages count
	 * @param {number} ram_used - Your ram usage
	 * @returns {Promise<{ ok: boolean; }>}
	 */
	async post(servers: number, users: number, channels: number, sent_messages: number, received_messages: number, ram_used: number) {
		return Request<{ ok: boolean; }>("/analytics/post", "POST", {
			servers,
			users,
			channels,
			sent_messages,
			received_messages,
			ram_used
		}, this.apiKey, this.userAgent);
	}

	/**
	 * Get your analytics
	 *
	 * @param {string} id - your user id
	 * @param {("latest" | "day" | "history")} type - The type of analytics to get
	 * @returns {promise<BotAnalytics>}
	 */
	async get(id: string, type: "latest" | "day" | "history") { return Request<BotAnalytics>(`/analytics/get${type}/${id}`, "GET", null, this.apiKey, this.userAgent); }

	/**
	 * Get your analytics
	 *
	 * Alias for get with type "latest"
	 *
	 * @param {string} id - your user id
	 * @returns {promise<BotAnalytics>}
	 */
	async getLatest(id: string) { return this.get(id, "latest"); }

	/**
	 * Get your analytics
	 *
	 * Alias for get with type "day"
	 *
	 * @param {string} id - your user id
	 * @returns {promise<BotAnalytics>}
	 */
	async getDay(id: string) { return this.get(id, "day"); }

	/**
	 * Get your analytics
	 *
	 * Alias for get with type "history"
	 *
	 * @param {string} id - your user id
	 * @returns {promise<BotAnalytics>}
	 */
	async getHistory(id: string) { return this.get(id, "history"); }

	/** @returns {Promise<string>} */
	async getInfoCard(id: string) { return Request<{ data: string; }>(`/analytics/infocard/${id}`, "GET", null, this.apiKey, this.userAgent).then(r => r.data); }
	/** @returns {Promise<string>} */
	async getShield(id: string, type: "servers" | "users" | "channels" | "sent_messages" | "received_messages" | "ram_used" | "created", format: "png" | "svg" = "png") { return Request(`/analytics/getshield/${id}/serve${type}/${format}`, "GET", null, this.apiKey, this.userAgent); }
	/** @returns {Promise<string>} */
	async getServersShield(id: string, format: "png" | "svg" = "png") { return this.getShield(id, "servers", format); }
	/** @returns {Promise<string>} */
	async getUsersShield(id: string, format: "png" | "svg" = "png") { return this.getShield(id, "users", format); }
	/** @returns {Promise<string>} */
	async getChannelsShield(id: string, format: "png" | "svg" = "png") { return this.getShield(id, "channels", format); }
	/** @returns {Promise<string>} */
	async getSentMessagesShield(id: string, format: "png" | "svg" = "png") { return this.getShield(id, "sent_messages", format); }
	/** @returns {Promise<string>} */
	async getReceivedMessagesShield(id: string, format: "png" | "svg" = "png") { return this.getShield(id, "received_messages", format); }
	/** @returns {Promise<string>} */
	async getRamUsedShield(id: string, format: "png" | "svg" = "png") { return this.getShield(id, "ram_used", format); }
	/** @returns {Promise<string>} */
	async getCreatedShield(id: string, format: "png" | "svg" = "png") { return this.getShield(id, "created", format); }

	/**
	 * Start auto posting
	 *
	 * @param {(import("eris").Client | import("discord.js").Client)} client
	 */
	initAutoPosting(client: GenericClient) {
		this.client = client;
		if ("readyAt" in client) {
			this.clientType = "discord.js";
			if (client.readyAt !== null) this.startAutoPost();
			else client.once("ready", this.startAutoPost.bind(this));
		} else if ("ready" in client) {
			this.clientType = "eris";
			if (client.ready === true) this.startAutoPost();
			else client.once("ready", this.startAutoPost.bind(this));
		}
	}

	private startAutoPost() {
		switch (this.clientType) {
			case "discord.js": {
				this.client.on("message", (msg: { author: { id: string; }; }) => {
					const client = this.client as GenericDiscordJSClient;
					this.receivedMessages++;
					if ("author" in msg && client.user !== null && msg.author.id === client.user.id) this.sentMessages++;
				});
				break;
			}

			case "eris": {
				this.client.on("messageCreate", (msg: { author: { id: string; }; }) => {
					const client = this.client as GenericErisClient;
					this.receivedMessages++;
					if ("author" in msg && msg.author.id === client.user.id) this.sentMessages++;
				});
				break;
			}
		}

		void this.sendAuto();
		this.interval  = setInterval(this.sendAuto.bind(this), 6.1e5);
	}

	private async sendAuto() {
		let servers: number, users: number, channels: number;
		switch (this.clientType) {
			case "eris": {
				const client = this.client as GenericErisClient;
				servers = client.guilds.size;
				users = client.users.size;
				channels= Object.keys(client.channelGuildMap).length;
				break;
			}

			case "discord.js": {
				const client = this.client as GenericDiscordJSClient;
				servers = client.guilds.cache.size;
				users = client.users.cache.size;
				channels = client.channels.cache.size;
				break;
			}
		}

		await this.post(servers, users, channels, this.sentMessages, this.receivedMessages, process.memoryUsage().rss);

		this.sentMessages = 0;
		this.receivedMessages = 0;
	}

	/** stop autoposting */
	stopAutoPost() {
		if (this.interval === undefined) return true;
		clearInterval(this.interval);
		this.interval = undefined;
		return true;
	}
}

// these types aren't exact, but they just need to be close enough to work,
// and to match the real types
interface GenericErisClient {
	ready: boolean;
	channelGuildMap: Record<string, unknown>;
	guilds: Map<unknown, unknown>;
	users: Map<unknown, unknown>;
	user: { id: string; };
}

interface DiscordJSCache {
	cache: Map<unknown, unknown>;
}

interface GenericDiscordJSClient {
	readyAt: Date | null;
	channels: DiscordJSCache;
	guilds: DiscordJSCache;
	users: DiscordJSCache;
	user: { id: string; } | null;
}

type GenericClient = EventEmitter & (GenericErisClient | GenericDiscordJSClient);
