import {Client, ComponentType, IntentsBitField} from "discord.js";
import {Config} from "./typings/Config";
import {Logger} from "./Logger";
import {PluginsNames} from "./typings/PluginsNames";
import {Handler} from "./Handler";
import {Database} from "./Database";
import * as fs from "fs";
import {PluginConfig} from "./typings/PluginConfig";

export class DBMClient extends Client {
    public config: Config;
    public logger: Logger;
    public plugins: { [k in PluginsNames]: { config: PluginConfig, main?: any}};
    public handler: Handler;
    public database: Database;
    public constructor(Intents: IntentsBitField[], config: Config) {
        super({
            intents: Intents
        });
        this.config = config;
        this.logger = new Logger(this);
        this.handler = new Handler(this);
        this.database = new Database(this);
        // @ts-ignore
        this.plugins = {};
        this.init();
    }

    public static extractIntents(config:Config): IntentsBitField[] {
        const intents: Set<IntentsBitField> = new Set;
        for (let i = 0; i < config.plugins.length; i++)
        {
            const plugin_config = require(`../../plugins/${config.plugins[i]}/plugin.config.json`);
            plugin_config.intentsDependencies.forEach((v: IntentsBitField) => intents.has(v) ? null : intents.add(v));
        }
        return [...intents];
    }

    private async init() {
        this.interactionHandler();
        this.logger.info(`Loading ${this.config.plugins.length} Plugins.`);
        await this.loadPlugins();
        this.logger.info(`Starting handler.`);
        await this.handler.init();
        this.logger.info(`Connecting to Database.`);
        await this.database.connect();
        await this.login(this.config.client.token);
    }

    private async loadPlugins() {
        await Promise.all(this.config.plugins.map(async v => {
            try {
                const plugin_config = require(`../../plugins/${v}/plugin.config.json`);
                const mainInstance = fs.existsSync(`./plugins/${v}/dist/index.js`) ? require(`../../plugins/${v}/dist/index.js`) : null;
                this.plugins[v] = {
                    config: plugin_config,
                    main: mainInstance ? new mainInstance.default(this) : null,
                };
                this.logger.info(`> Plugin ${v} loaded`);
            } catch (e) {
                this.logger.warn(`> Fail on loading plugin ${v}`, e);
            }
        }))
    }

    private interactionHandler() {
        this.on('interactionCreate', interaction => {
            if (interaction.isChatInputCommand())
            {
                const command = this.handler.slashcommands?.data.get(interaction.commandName);
                if (!command)return this.logger.warn(`slashcommand ${interaction.commandName} not found`);
                command.execute(this, this.plugins[command.plugin_name].main, interaction);
            } else if (interaction.isAutocomplete())
            {

                const command = this.handler.slashcommands?.data.get(interaction.commandName);
                if (!command || !command?.autocomplete)return this.logger.warn(`autocomplete ${interaction.commandName} not found`);
                command.autocomplete(this, this.plugins[command.plugin_name].main, interaction);
            } else if (interaction.isMessageComponent())
            {
                const componentsData = this.handler.components?.data.get(ComponentType[interaction.componentType] as keyof typeof ComponentType);
                const component = componentsData?.get(interaction.customId.split("#")[0]);
                if (!component)return this.logger.warn(`component ${ComponentType[interaction.componentType]} ${interaction.customId.split("#")[0]} not found`);
                component.execute(this, this.plugins[component.plugin_name].main, interaction);
            }
        })
    }
}