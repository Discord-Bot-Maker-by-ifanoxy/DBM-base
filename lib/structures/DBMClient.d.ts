import { Client, IntentsBitField } from "discord.js";
import { Config } from "./typings/Config";
import { Logger } from "./Logger";
import { PluginsNames } from "./typings/PluginsNames";
import { Handler } from "./Handler";
import { Database } from "./Database";
import { PluginConfig } from "./typings/PluginConfig";
export declare class DBMClient extends Client {
    config: Config;
    logger: Logger;
    plugins: {
        [k in PluginsNames]: {
            config: PluginConfig;
            main?: any;
        };
    };
    handler: Handler;
    database: Database;
    constructor(Intents: IntentsBitField[], config: Config);
    static extractIntents(config: Config): IntentsBitField[];
    private init;
    private loadPlugins;
    private interactionHandler;
}
