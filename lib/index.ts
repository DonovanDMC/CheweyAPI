import Request from "./Request";
import Analytics from "./Analytics";
import type { ImagesStructure } from "./types";
import { CreateImagesWrapper } from "./Util";
import pkg from "../package.json";
export type * from "./types";

export default class CheweyAPI {
    analytics = new Analytics(this);
    apiKey: string;
    images: ImagesStructure;
    userAgent: string;
    /**
     * Construct a new instance of CheweyAPI
     *
     * @param apiKey Your api key, required
     * @param userAgent The user agent to use in requests
     */
    constructor(apiKey: string, userAgent?: string) {
        if (!apiKey) {
            throw new Error("An api key is required.");
        }
        this.apiKey = apiKey;
        this.userAgent = userAgent ?? `CheweyAPI/${pkg.version} (https://npm.im/cheweyapi)`;
        this.images = CreateImagesWrapper((path, raw) => this.request<{ data: string; }>("GET", path).then(r => raw ? r : r.data));
    }

    /**
     * Get a list of the available endpoints.
     */
    async getEndpoints() {
        return this.request<{ data: Record<string, string>; }>("GET", "/endpoints").then(d => Object.keys(d.data));
    }

    /**
     * Generate a minecraft server banner image
     *
     * @param ip The ip or host of the server
     * @param port The port of the server, default 25565
     * @param bg The background type
     */
    async mcap(ip: string, port = 25565, bg: "default" | "nether" | "night" | "sunset" = "default") {
        return this.request<{ data: string; }>("GET", `/mcap/server/${ip}/${port}/${bg}`).then(r => r.data);
    }

    /** @internal */
    async request<R extends Record<string, unknown> | string>(method: "GET" | "POST", path: string, body?: Record<string, unknown>, followRedirects?: boolean) {
        return Request<R>(path, method, body ?? null, this.apiKey, this.userAgent, followRedirects);
    }
}
