import {IntentsBitField} from "discord.js";
import {LoggerLevels} from "./LoggerLevels";
import {PluginsNames} from "./PluginsNames";

export interface Config {
    client: {
        token: string
    }
    plugins: {
        name: PluginsNames
        intentsDependencies: IntentsBitField[],
        commandsDir?: string,
        componentsDir?: string,
        eventsDir?: string,
    }[],
    logger_levels: LoggerLevels
}