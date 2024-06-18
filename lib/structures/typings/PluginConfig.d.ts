import { IntentsBitField } from "discord.js";
import { PluginsNames } from "./PluginsNames";
export interface PluginConfig {
    name: PluginsNames;
    intentsDependencies: IntentsBitField[];
    commandsDir?: string;
    componentsDir?: string;
    eventsDir?: string;
}
