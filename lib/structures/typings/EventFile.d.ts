import { Events } from "discord.js";
import { DBMClient } from "../DBMClient";
import { Embed } from "discord.js/typings";
import { PluginsNames } from "./PluginsNames";
export interface EventFile<Event extends keyof Events | any = any> {
    name: Events;
    execute: (client: DBMClient, plugin: any | null, ...args: Event extends keyof Events ? Events[Event][] : any[]) => unknown;
    embeds: {
        [k: string]: Embed;
    };
    plugin_name: PluginsNames;
}
