import {Client, IntentsBitField} from "discord.js";
import {Config} from "./typings/Config";
import {Logger} from "./Logger";
import {PluginBase} from "./PluginBase";
import {PluginsNames} from "./typings/PluginsNames";
import {Handler} from "./Handler";

export class DBMClient extends Client {
    public config: Config;
    public logger: Logger;
    public plugins: { [k in PluginsNames]?: PluginBase};
    public handler: Handler;
    public constructor(Intents: IntentsBitField[], config: Config) {
        super({
            intents: Intents
        });
        this.config = config;
        this.logger = new Logger(this);
        this.handler = new Handler(this);
        this.plugins = {};
        this.init();
    }

    public static extractIntents(config:Config): IntentsBitField[] {
        const intents: Set<IntentsBitField> = new Set;
        for (let i = 0; i < config.plugins.length; i++)
        {
            config.plugins[i].intentsDependencies.forEach(v => intents.has(v) ? null : intents.add(v));
        }
        return [...intents];
    }

    private async init() {
        this.logger.info(`Loading ${this.config.plugins.length} Plugins.`)
        await this.loadPlugins();
        this.logger.info(`Starting handler.`)
        await this.handler.init();
        await this.login(this.config.client.token);
    }

    private async loadPlugins() {
        await Promise.all(this.config.plugins.map(async v => {
            try {
                const dist = require(`../../plugins/${v.name}`);
                this.logger.info(`> Plugin ${v.name} loaded`);
                this.plugins[v.name] = new dist(this) as PluginBase;
            } catch {
                this.logger.warn(`> Fail on loading plugin ${v.name}`)
            }
        }))
    }
}