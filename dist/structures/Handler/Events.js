"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const Handler_1 = require("../Handler");
class Events {
    constructor(client) {
        this.client = client;
        this.loadEvents();
    }
    loadEvents() {
        this.client.logger.info('Loading events');
        let events = {};
        this.client.config.plugins.map(x => { var _a; return (_a = this.client.plugins[x]) === null || _a === void 0 ? void 0 : _a.config; }).filter(x => x === null || x === void 0 ? void 0 : x.eventsDir).forEach(v => {
            var _a;
            try {
                const eventsPath = Handler_1.Handler.getPathsFiles(`./plugins/${v.name}/dist/${v.eventsDir}`);
                for (let path of eventsPath) {
                    const dist = require('../../../' + path).default;
                    this.client.logger.info(`> Plugin ${v.name} - ${dist.name} events added`);
                    if (!events[dist.name])
                        events[dist.name] = [];
                    (_a = events[dist.name]) === null || _a === void 0 ? void 0 : _a.push({ run: dist.execute, plugin_name: v.name });
                }
            }
            catch (e) {
                this.client.logger.warn(`> Fail on loading events in ${v.name} plugin`, e);
            }
        });
        Object.entries(events).forEach(([k, v]) => {
            this.client.on(k, (...args) => {
                v.forEach(x => {
                    x.run(this.client, ...args);
                });
            });
        });
    }
}
exports.Events = Events;
