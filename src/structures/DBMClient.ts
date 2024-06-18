import {Client, IntentsBitField} from "discord.js";
import {Config} from "./typings/Config";
import {Logger} from "./Logger";
import {PluginsNames} from "./typings/PluginsNames";
import {Handler} from "./Handler";
import {Database} from "./Database";
import * as fs from "fs";

export class DBMClient extends Client {
    public config: Config;
    public logger: Logger;
    public plugins: { [k in PluginsNames]?: { config: any, main?: any}};
    public handler: Handler;
    private database: Database;
    public constructor(Intents: IntentsBitField[], config: Config) {
        super({
            intents: Intents
        });
        this.config = config;
        this.logger = new Logger(this);
        this.handler = new Handler(this);
        this.database = new Database(this);
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
                const mainInstance = fs.existsSync(`./plugins/${v}/index.js`) ? require(`../../plugins/${v}/index.js`) : null;
                this.plugins[v] = {
                    config: plugin_config,
                    main: mainInstance ? new mainInstance(this) : null,
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
                const embed = require(`../../plugins/${command.plugin_name}/${command.embeds_path}`);
                command.execute(this, interaction, embed ?? {});
            }
        })
    }
}