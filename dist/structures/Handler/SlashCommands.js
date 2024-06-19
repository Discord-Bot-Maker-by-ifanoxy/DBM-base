"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommands = void 0;
const Handler_1 = require("../Handler");
const discord_js_1 = require("discord.js");
class SlashCommands {
    constructor(client) {
        this.client = client;
        this.data = new discord_js_1.Collection();
        this.loadSlashCommands();
        this.client.once('ready', e => e.application.commands.set(this.data.map(x => x.builder.toJSON())));
    }
    loadSlashCommands() {
        this.client.logger.info('Loading Slashcommands');
        let commandsPath = [];
        this.client.config.plugins.map(x => this.client.plugins[x].config).filter(x => x === null || x === void 0 ? void 0 : x.commandsDir).forEach(v => {
            try {
                const commands = Handler_1.Handler.getPathsFiles(`./plugins/${v.name}/dist/${v.commandsDir}`);
                this.client.logger.info(`> Plugin ${v.name} - ${commands.length} slashcommands added`);
                commandsPath.push([v.name, commands]);
            }
            catch (_a) {
                this.client.logger.warn(`> Fail on loading slashcommands in ${v.name} plugin`);
            }
        });
        for (let plugin of commandsPath) {
            for (let path of plugin[1]) {
                const dist = require('../../../' + path).default;
                this.data.set(dist.builder.name, Object.assign(Object.assign({}, dist), { plugin_name: plugin[0] }));
            }
        }
    }
}
exports.SlashCommands = SlashCommands;
