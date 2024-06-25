import {Client, ComponentType, GatewayIntentBits, IntentsBitField} from "discord.js";
import {Config} from "./typings/Config";
import {Logger} from "./Logger";
import {PluginsNames} from "./typings/PluginsNames";
import {Handler} from "./Handler";
import {Database} from "./Database";
import * as fs from "fs";
import {PluginConfig} from "./typings/PluginConfig";
import {GatewayIntentsString} from "discord.js/typings";

export class DBMClient extends Client {
    public config: Config;
    public logger: Logger;
    public plugins: { [k in PluginsNames]: { config: PluginConfig, main?: any}} | {} = {};
    public handler: Handler;
    public database: Database;
    public constructor(Intents: GatewayIntentsString[], config: Config) {
        super({
            intents: new IntentsBitField(Intents)
        });
        this.config = config;
        this.logger = new Logger(this);
        this.handler = new Handler(this);
        this.init();
    }

    public static extractIntents(config:Config): GatewayIntentsString[] {
        let intents: GatewayIntentsString[] = [];
        for (let i = 0; i < config.plugins.length; i++)
        {
            const plugin_config = require(`../../plugins/${config.plugins[i]}/plugin.config.json`);
            plugin_config.intentsDependencies.forEach((v: number) => intents = intents.concat(new IntentsBitField(v).toArray()));
        }
        return [...new Set(intents)];
    }

    private async init() {
        this.logger.info('Initialization of database');
        await Database.createDatabase(this.config.database);
        this.database = new Database(this);
        this.logger.info(`Connecting to Database.`);
        await this.database.connect();
        this.loadlisteners();
        this.logger.info(`Loading ${this.config.plugins.length} Plugins.`);
        await this.loadPlugins();
        this.logger.info(`Starting handler.`);
        await this.handler.init();
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

    private loadlisteners() {
        this.on('interactionCreate', interaction => {
            if (interaction.isChatInputCommand())
            {
                this.logger.trace(`${interaction.user.username} call ${interaction.commandName} slash command`);
                const command = this.handler.slashcommands?.data.get(interaction.commandName);
                if (!command)return this.logger.warn(`slashcommand ${interaction.commandName} not found`);
                command.execute(this, interaction, this.plugins[command.plugin_name].main);
            } else if (interaction.isAutocomplete())
            {
                this.logger.trace(`${interaction.user.username} call ${interaction.commandName} auto complete`);
                const command = this.handler.slashcommands?.data.get(interaction.commandName);
                if (!command || !command?.autocomplete)return this.logger.warn(`autocomplete ${interaction.commandName} not found`);
                command.autocomplete(this, interaction, this.plugins[command.plugin_name].main);
            } else if (interaction.isMessageComponent())
            {
                this.logger.trace(`${interaction.user.username} call ${interaction.customId} ${ComponentType[interaction.componentType]}`);
                if (interaction.customId.startsWith('[no-check]'))return;
                const componentsData = this.handler.components?.data.get(ComponentType[interaction.componentType] as keyof typeof ComponentType);
                const component = componentsData?.get(interaction.customId.split("#")[0]);
                if (!component)return this.logger.warn(`component ${ComponentType[interaction.componentType]} ${interaction.customId.split("#")[0]} not found`);
                component.execute(this, interaction, this.plugins[component.plugin_name].main);
            }
        });

        this.on("warn", (message) => this.logger.warn(message));
        this.on("error", (error) => this.logger.error(error));
    }
}