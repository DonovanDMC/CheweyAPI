import { EventEmitter } from "node:events";

export interface GenericManager {
    cache: Map<unknown, unknown>;
}

export declare class GenericClient extends EventEmitter {
    channels: GenericManager;
    guilds: GenericManager;
    readyAt: Date | null;
    user: { id: string; } | null;
    users: GenericManager;
    constructor(...args: Array<unknown>);
}

export function getStats(client: GenericClient) {
    return {
        servers:  client.guilds.cache.size,
        users:    client.users.cache.size,
        channels: client.channels.cache.size
    };
}

export function isClient(client: object): client is GenericClient {
    return "readyAt" in client;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let listener: ((...args: Array<any>) => any) | null = null;
export function startMessages(client: GenericClient, addSend: () => void, addReceive: () => void) {
    const duplicate = listener && client.listeners("messageCreate").includes(listener);
    if (listener === null || !duplicate) {
        client.on("messageCreate", listener ??= (msg: { author: { id: string; }; }) => {
            addReceive();
            if ("author" in msg && client.user !== null && msg.author.id === client.user.id) {
                addSend();
            }
        });
    }

    if (duplicate) {
        process.emitWarning("CheweyAPI Auto Posting: Duplicate Listener", {
            code:   "DUPLICATE_LISTENER_DISCORDJS",
            detail: "An attempt was made to add a listener to the messageCreate event for stats, but one is already registered."
        });
    }
}
