import type * as DiscordJS from "./discord.js.js";
export * as DiscordJS from "./discord.js.js";
import type * as Eris from "./eris.js";
export * as Eris from "./eris.js";
import type * as Oceanic from "./oceanic.js.js";
export * as Oceanic from "./oceanic.js.js";

export type GenericClient = DiscordJS.GenericClient | Eris.GenericClient | Oceanic.GenericClient;
