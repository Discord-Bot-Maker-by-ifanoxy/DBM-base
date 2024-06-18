import { Collection, ComponentType } from "discord.js";
import { DBMClient } from "../DBMClient";
import { ComponentFile } from "../typings/ComponentFile";
export declare class Components {
    private client;
    data: Collection<keyof typeof ComponentType, Collection<string, ComponentFile>>;
    constructor(client: DBMClient);
    loadComponents(): void;
}
