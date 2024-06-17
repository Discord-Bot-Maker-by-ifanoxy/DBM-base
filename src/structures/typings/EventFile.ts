import {ClientEvents} from "discord.js";
import {DBMClient} from "../DBMClient";

export interface EventFile<Event extends keyof ClientEvents | any = any, T extends object = {},  > {
    name: keyof ClientEvents,
    execute: (client: DBMClient, embeds: T, ...args: Event extends keyof ClientEvents ? ClientEvents[Event] : any[]) => unknown,
    embeds_path: string
}