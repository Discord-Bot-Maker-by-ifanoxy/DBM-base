import { Collection } from "discord.js";
import { SlashCommandFile } from "../typings/SlashCommandFile";
import { DBMClient } from "../DBMClient";
export declare class SlashCommands {
    private client;
    data: Collection<string, SlashCommandFile>;
    constructor(client: DBMClient);
    loadSlashCommands(): void;
}
