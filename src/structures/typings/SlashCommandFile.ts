import {AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {DBMClient} from "../DBMClient";

export interface SlashCommandFile<T extends object = {}> {
    builder: SlashCommandBuilder,
    autocomplete: (client: DBMClient, interaction: AutocompleteInteraction, embeds: T) => unknown,
    execute: (client: DBMClient, interaction: ChatInputCommandInteraction, embeds: T) => unknown,
    embeds_path: string,
    plugin_name: string
}