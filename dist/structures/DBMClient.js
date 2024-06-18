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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBMClient = void 0;
const discord_js_1 = require("discord.js");
const Logger_1 = require("./Logger");
const Handler_1 = require("./Handler");
const Database_1 = require("./Database");
const fs = __importStar(require("fs"));
class DBMClient extends discord_js_1.Client {
    constructor(Intents, config) {
        super({
            intents: Intents
        });
        this.config = config;
        this.logger = new Logger_1.Logger(this);
        this.handler = new Handler_1.Handler(this);
        this.database = new Database_1.Database(this);
        this.plugins = {};
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
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info(`Loading ${this.config.plugins.length} Plugins.`);
            yield this.loadPlugins();
            this.logger.info(`Starting handler.`);
            yield this.handler.init();
            this.logger.info(`Connecting to Database.`);
            yield this.database.connect();
            yield this.login(this.config.client.token);
        });
    }
    loadPlugins() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.config.plugins.map((v) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const plugin_config = require(`../../plugins/${v}/plugin.config.json`);
                    const mainInstance = fs.existsSync(`./plugins/${v}/index.js`) ? require(`../../plugins/${v}/index.js`) : null;
                    this.plugins[v] = {
                        config: plugin_config,
                        main: mainInstance ? new mainInstance(this) : null,
                    };
                    this.logger.info(`> Plugin ${v} loaded`);
                }
                catch (e) {
                    this.logger.warn(`> Fail on loading plugin ${v}`, e);
                }
            })));
        });
    }
    interactionHandler() {
        this.on('interactionCreate', interaction => {
            var _a;
            if (interaction.isChatInputCommand()) {
                const command = (_a = this.handler.slashcommands) === null || _a === void 0 ? void 0 : _a.data.get(interaction.commandName);
                if (!command)
                    return this.logger.warn(`slashcommand ${interaction.commandName} not found`);
                const embed = require(`../../plugins/${command.plugin_name}/${command.embeds_path}`);
                command.execute(this, interaction, embed !== null && embed !== void 0 ? embed : {});
            }
        });
    }
}
exports.DBMClient = DBMClient;
