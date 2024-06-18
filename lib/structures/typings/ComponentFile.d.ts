import { AnySelectMenuInteraction, AutocompleteInteraction, ButtonInteraction, ComponentType, ModalSubmitInteraction } from "discord.js";
import { DBMClient } from "../DBMClient";
import { Embed } from "discord.js/typings";
import { PluginsNames } from "./PluginsNames";
type AnyInteraction = AutocompleteInteraction | ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction;
export interface ComponentFile<I extends AnyInteraction | any = any> {
    customId: string;
    type: ComponentType;
    execute: (client: DBMClient, plugin: any | null, interaction: I extends AnyInteraction ? I : any) => unknown;
    embeds: {
        [k: string]: Embed;
    };
    plugin_name: PluginsNames;
}
export {};
