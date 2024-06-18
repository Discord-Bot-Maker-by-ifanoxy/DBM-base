import { AutocompleteInteraction, ChatInputCommandInteraction, Embed, SlashCommandBuilder } from "discord.js";
import { DBMClient } from "../DBMClient";
import { PluginsNames } from "./PluginsNames";
export interface SlashCommandFile {
    builder: SlashCommandBuilder;
    autocomplete?: (client: DBMClient, plugin: any | null, interaction: AutocompleteInteraction) => unknown;
    execute: (client: DBMClient, plugin: any | null, interaction: ChatInputCommandInteraction) => unknown;
    embeds: {
        [k: string]: Embed;
    };
    plugin_name: PluginsNames;
}
