import type CheweyAPI from ".";
import { DiscordJS, Eris, Oceanic, type GenericClient } from "./analytics";

interface AutoPostingOptions {
    client: DiscordJS.GenericClient | Eris.GenericClient | Oceanic.GenericClient;
    interval?: number;
    messages?: boolean;
    postOnStart?: boolean;
    getMemoryUsage?(this: void): number;
}

export type PostStats = Record<"servers" | "users" | "channels" | "sent_messages" | "received_messages" | "ram_used", number>;
export type BotAnalytics = PostStats & { created: string; };
export default class CheweyBotAPIAnalytics {
    private client: GenericClient | undefined;
    private clientType: "discord.js" | "eris" | "oceanic" | undefined;
    private interval: NodeJS.Timeout | undefined;
    private messages = true;
    private onReceive: () => void;
    private onSend: () => void;
    private postOnStart = true;
    private receivedMessages = 0;
    private sentMessages = 0;
    private timeBetweenPosting = 6.1e5;
    api: CheweyAPI;
    constructor(api: CheweyAPI) {
        this.api = api;
        // if they're initialized inline, the linter will move them down under initMessages
        this.onReceive = () => this.receivedMessages++;
        this.onSend = () => this.sentMessages++;
    }

    private getMemoryUsage: (this: void) => number = () => process.memoryUsage().rss;

    private initMessages() {
        if (this.messages === false) {
            return;
        }
        // eslint-disable-next-line unicorn/consistent-function-scoping
        switch (this.clientType) {
            case "discord.js": {
                if (this.messages) {
                    DiscordJS.startMessages(this.client! as DiscordJS.GenericClient, this.onSend, this.onReceive);
                }
                break;
            }

            case "eris": {
                if (this.messages) {
                    Eris.startMessages(this.client! as Eris.GenericClient, this.onSend, this.onReceive);
                }
                break;
            }

            case "oceanic": {
                if (this.messages) {
                    Oceanic.startMessages(this.client! as Oceanic.GenericClient, this.onSend, this.onReceive);
                }
                break;
            }
        }
    }

    private async sendAuto() {
        let stats: Pick<PostStats, "servers" | "users" | "channels">;
        switch (this.clientType) {
            case "discord.js": {
                stats = DiscordJS.getStats(this.client! as DiscordJS.GenericClient);
                break;
            }

            case "eris": {
                stats = Eris.getStats(this.client! as Eris.GenericClient);
                break;
            }

            case "oceanic": {
                stats = Oceanic.getStats(this.client! as Oceanic.GenericClient);
                break;
            }

            default: {
                throw new Error("Invalid client type");
            }
        }

        await this.post({
            ...stats,
            sent_messages:     this.sentMessages,
            received_messages: this.receivedMessages,
            ram_used:          this.getMemoryUsage()
        });
    }

    private startAutoPost() {
        this.initMessages();

        if (this.postOnStart) {
            void this.sendAuto();
        }
        this.interval = setInterval(this.sendAuto.bind(this), this.timeBetweenPosting);
    }

    /**
     * Get your analytics
     *
     * @param id Your user id.
     * @param type The type of analytics to get.
     */
    async get(id: string, type: "latest" | "day" | "history") {
        return this.api.request<BotAnalytics>("GET", `/analytics/get${type}/${id}`);
    }

    async getChannelsShield(id: string, format: "png" | "svg" = "png") {
        return this.getShield(id, "channels", format);
    }

    async getCreatedShield(id: string, format: "png" | "svg" = "png") {
        return this.getShield(id, "created", format);
    }

    /**
     * Get your analytics
     *
     * Alias for get with type "day"
     *
     * @param id Your user id.
     */
    async getDay(id: string) {
        return this.get(id, "day");
    }

    /**
     * Get your analytics
     *
     * Alias for get with type "history"
     *
     * @param id Your user id.
     */
    async getHistory(id: string) {
        return this.get(id, "history");
    }

    async getInfoCard(id: string) {
        return this.api.request<{ data: string; }>("GET", `/analytics/infocard/${id}`).then(r => r.data);
    }

    /**
     * Get your analytics
     *
     * Alias for get with type "latest"
     *
     * @param id Your user id.
     */
    async getLatest(id: string) {
        return this.get(id, "latest");
    }

    async getRamUsedShield(id: string, format: "png" | "svg" = "png") {
        return this.getShield(id, "ram_used", format);
    }

    async getReceivedMessagesShield(id: string, format: "png" | "svg" = "png") {
        return this.getShield(id, "received_messages", format);
    }

    async getSentMessagesShield(id: string, format: "png" | "svg" = "png") {
        return this.getShield(id, "sent_messages", format);
    }

    async getServersShield(id: string, format: "png" | "svg" = "png") {
        return this.getShield(id, "servers", format);
    }

    async getShield(id: string, type: "servers" | "users" | "channels" | "sent_messages" | "received_messages" | "ram_used" | "created", format: "png" | "svg" = "png") {
        return this.api.request<string>("GET", `/analytics/getshield/${id}/${type}/${format}`, undefined, false);
    }

    async getUsersShield(id: string, format: "png" | "svg" = "png") {
        return this.getShield(id, "users", format);
    }

    /**
     * Enable auto posting.
     *
     * Tested with:
     * * Discord.JS 14.13.0
     * * Eris 0.17.2
     * * Oceanic 1.8.1
     */
    initAutoPosting(options: AutoPostingOptions | GenericClient) {
        let client: GenericClient;
        const objPrototype = Object.getPrototypeOf({}) as object;
        if (Object.getPrototypeOf(options) === objPrototype) {
            const opt = options as AutoPostingOptions;
            client = this.client = opt.client;

            if (opt.getMemoryUsage !== undefined) {
                this.getMemoryUsage = opt.getMemoryUsage;
            }

            if (opt.interval !== undefined) {
                this.timeBetweenPosting = opt.interval;
            }

            if (opt.messages !== undefined) {
                this.messages = opt.messages;
            }

            if (opt.postOnStart !== undefined) {
                this.postOnStart = opt.postOnStart;
            }
        } else {
            client = options as GenericClient;
        }

        if (DiscordJS.isClient(client)) {
            this.clientType = "discord.js";
            if (client.readyAt === null) {
                client.once("ready", this.startAutoPost.bind(this));
            } else {
                this.startAutoPost();
            }
        } else if (Eris.isClient(client)) {
            this.clientType = "eris";
            if (client.ready === true) {
                this.startAutoPost();
            } else {
                client.once("ready", this.startAutoPost.bind(this));
            }
        } else if (Oceanic.isClient(client)) {
            this.clientType = "oceanic";
            if (client.ready === true) {
                this.startAutoPost();
            } else {
                client.once("ready", this.startAutoPost.bind(this));
            }
        }
    }

    /**
     * Manually post your analytics
     *
     * @param data The stats to post
     */
    async post(data: PostStats) {
        return data;
        // return this.api.request<{ ok: boolean; }>("POST", "/analytics/post", data);
    }

    /** stop autoposting */
    stopAutoPost() {
        if (this.interval === undefined) {
            return true;
        }
        clearInterval(this.interval);
        this.interval = undefined;
        return true;
    }
}
