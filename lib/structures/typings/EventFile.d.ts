import { Events } from "discord.js";
import { DBMClient } from "../DBMClient";
import { Embed } from "discord.js/typings";
export interface EventFile<Event extends keyof Events | any = any> {
    name: Events;
    execute: (client: DBMClient, ...args: Event extends keyof Events ? Events[Event][] : any[]) => unknown;
    embeds: {
        [k: string]: Embed;
    };
}
