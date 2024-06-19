import {AutocompleteInteraction, ChatInputCommandInteraction, Embed, SlashCommandBuilder} from "discord.js";
import {DBMClient} from "../DBMClient";
import {PluginsNames} from "./PluginsNames";

export interface SlashCommandFile {
    builder: SlashCommandBuilder,
    autocomplete?: (client: DBMClient, interaction: AutocompleteInteraction, plugin: any | null) => unknown,
    execute: (client: DBMClient, interaction: ChatInputCommandInteraction, plugin: any | null) => unknown,
    embeds: { [k: string]: Embed},
    plugin_name: PluginsNames
}