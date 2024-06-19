"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Components = void 0;
const Handler_1 = require("../Handler");
const discord_js_1 = require("discord.js");
class Components {
    client;
    data;
    constructor(client) {
        this.client = client;
        this.data = new discord_js_1.Collection();
        Object.values(discord_js_1.ComponentType).forEach(v => {
            this.data.set(v, new discord_js_1.Collection());
        });
        this.loadComponents();
    }
    loadComponents() {
        this.client.logger.info('Loading Components');
        let componentsPath = [];
        this.client.config.plugins.map(x => this.client.plugins[x]?.config).filter(x => x?.componentsDir).forEach(v => {
            try {
                const components = Handler_1.Handler.getPathsFiles(`./plugins/${v.name}/dist/${v.componentsDir}`);
                this.client.logger.info(`> Plugin ${v.name} - ${components.length} components added`);
                componentsPath.push([v.name, components]);
            }
            catch {
                this.client.logger.warn(`> Fail on loading components in ${v.name} plugin`);
            }
        });
        for (let plugin of componentsPath) {
            for (let path of plugin[1]) {
                const dist = require('../../../' + path).default;
                const type = this.data.get(discord_js_1.ComponentType[dist.type]);
                type?.set(dist.customId, { ...dist, plugin_name: plugin[0] });
            }
        }
    }
}
exports.Components = Components;
