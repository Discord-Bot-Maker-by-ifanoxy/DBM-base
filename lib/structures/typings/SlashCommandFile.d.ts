import { AutocompleteInteraction, ChatInputCommandInteraction, Embed, SlashCommandBuilder } from "discord.js";
import { DBMClient } from "../DBMClient";
export interface SlashCommandFile {
    builder: SlashCommandBuilder;
    autocomplete?: (client: DBMClient, interaction: AutocompleteInteraction) => unknown;
    execute: (client: DBMClient, interaction: ChatInputCommandInteraction) => unknown;
    embeds: {
        [k: string]: Embed;
    };
    plugin_name: string;
}
