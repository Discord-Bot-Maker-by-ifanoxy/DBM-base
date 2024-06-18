"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Components = void 0;
const Handler_1 = require("../Handler");
const discord_js_1 = require("discord.js");
class Components {
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
        this.client.config.plugins.map(x => { var _a; return (_a = this.client.plugins[x]) === null || _a === void 0 ? void 0 : _a.config; }).filter(x => x === null || x === void 0 ? void 0 : x.componentsDir).forEach(v => {
            try {
                const components = Handler_1.Handler.getPathsFiles(`./plugins/${v.name}/${v.componentsDir}`);
                this.client.logger.info(`> Plugin ${v.name} - ${components.length} components added`);
                componentsPath.concat(components);
            }
            catch (_a) {
                this.client.logger.warn(`> Fail on loading components in ${v.name} plugin`);
            }
        });
        for (let path of componentsPath) {
            const dist = require('../../../' + path);
            const type = this.data.get(discord_js_1.ComponentType[dist.type]);
            type === null || type === void 0 ? void 0 : type.set(dist.customId, dist);
        }
    }
}
exports.Components = Components;
