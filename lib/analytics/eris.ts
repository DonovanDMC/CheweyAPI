import EventEmitter from "node:events";

export declare class GenericClient extends EventEmitter {
    bot: boolean;
    channelGuildMap: Record<string, unknown>;
    guilds: Map<unknown, unknown>;
    ready: boolean;
    user: { id: string; };
    users: Map<unknown, unknown>;
    constructor(...args: Array<unknown>);
}

export function getStats(client: GenericClient) {
    return {
        servers:  client.guilds.size,
        users:    client.users.size,
        channels: Object.keys(client.channelGuildMap).length
    };
}

export function isClient(client: object): client is GenericClient {
    return "bot" in client;
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
            code:   "DUPLICATE_LISTENER_ERIS",
            detail: "An attempt was made to add a listener to the messageCreate event for stats, but one is already registered."
        });
    }
}
