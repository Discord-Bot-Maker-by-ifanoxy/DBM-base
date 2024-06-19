"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBMClient = void 0;
const discord_js_1 = require("discord.js");
const Logger_1 = require("./Logger");
const Handler_1 = require("./Handler");
const Database_1 = require("./Database");
const fs = __importStar(require("fs"));
class DBMClient extends discord_js_1.Client {
    config;
    logger;
    plugins = {};
    handler;
    database;
    constructor(Intents, config) {
        super({
            intents: Intents
        });
        this.config = config;
        this.logger = new Logger_1.Logger(this);
        this.handler = new Handler_1.Handler(this);
        this.init();
    }
    static extractIntents(config) {
        const intents = new Set;
        for (let i = 0; i < config.plugins.length; i++) {
            const plugin_config = require(`../../plugins/${config.plugins[i]}/plugin.config.json`);
            plugin_config.intentsDependencies.forEach((v) => intents.has(v) ? null : intents.add(v));
        }
        return [...intents];
    }
    async init() {
        this.logger.info('Initialization of database');
        await Database_1.Database.createDatabase(this.config.database);
        this.database = new Database_1.Database(this);
        this.logger.info(`Connecting to Database.`);
        await this.database.connect();
        this.loadlisteners();
        this.logger.info(`Loading ${this.config.plugins.length} Plugins.`);
        await this.loadPlugins();
        this.logger.info(`Starting handler.`);
        await this.handler.init();
        await this.login(this.config.client.token);
    }
    async loadPlugins() {
        await Promise.all(this.config.plugins.map(async (v) => {
            try {
                const plugin_config = require(`../../plugins/${v}/plugin.config.json`);
                const mainInstance = fs.existsSync(`./plugins/${v}/dist/index.js`) ? require(`../../plugins/${v}/dist/index.js`) : null;
                this.plugins[v] = {
                    config: plugin_config,
                    main: mainInstance ? new mainInstance.default(this) : null,
                };
                this.logger.info(`> Plugin ${v} loaded`);
            }
            catch (e) {
                this.logger.warn(`> Fail on loading plugin ${v}`, e);
            }
        }));
    }
    loadlisteners() {
        this.on('interactionCreate', interaction => {
            if (interaction.isChatInputCommand()) {
                this.logger.trace(`${interaction.user.username} call ${interaction.commandName} slash command`);
                const command = this.handler.slashcommands?.data.get(interaction.commandName);
                if (!command)
                    return this.logger.warn(`slashcommand ${interaction.commandName} not found`);
                command.execute(this, interaction, this.plugins[command.plugin_name].main);
            }
            else if (interaction.isAutocomplete()) {
                this.logger.trace(`${interaction.user.username} call ${interaction.commandName} auto complete`);
                const command = this.handler.slashcommands?.data.get(interaction.commandName);
                if (!command || !command?.autocomplete)
                    return this.logger.warn(`autocomplete ${interaction.commandName} not found`);
                command.autocomplete(this, interaction, this.plugins[command.plugin_name].main);
            }
            else if (interaction.isMessageComponent()) {
                this.logger.trace(`${interaction.user.username} call ${interaction.customId} ${discord_js_1.ComponentType[interaction.componentType]}`);
                if (interaction.customId.startsWith('[no-check]'))
                    return;
                const componentsData = this.handler.components?.data.get(discord_js_1.ComponentType[interaction.componentType]);
                const component = componentsData?.get(interaction.customId.split("#")[0]);
                if (!component)
                    return this.logger.warn(`component ${discord_js_1.ComponentType[interaction.componentType]} ${interaction.customId.split("#")[0]} not found`);
                component.execute(this, interaction, this.plugins[component.plugin_name].main);
            }
        });
        this.on("warn", (message) => this.logger.warn(message));
        this.on("error", (error) => this.logger.error(error));
    }
}
exports.DBMClient = DBMClient;
