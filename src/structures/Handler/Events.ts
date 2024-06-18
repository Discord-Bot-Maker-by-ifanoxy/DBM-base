import {Handler} from "../Handler";
import {Events as DiscordEvents} from "discord.js";
import {DBMClient} from "../DBMClient";
import {EventFile} from "../typings/EventFile";
import {PluginsNames} from "../typings/PluginsNames";

export class Events {
    private client: DBMClient;
    constructor(client: DBMClient) {
        this.client = client;
        this.loadEvents();
    }

    public loadEvents() {
        this.client.logger.info('Loading events')
        let events: { [k in DiscordEvents]?: {run: any, plugin_name: string }[]} = {};
        this.client.config.plugins.map(x => this.client.plugins[x]?.config).filter(x => x?.eventsDir).forEach(v => {
            try {
                const eventsPath = Handler.getPathsFiles(`./plugins/${v.name}/dist/${v.eventsDir}`);
                for (let path of eventsPath)
                {
                    const dist = require('../../../' + path).default as EventFile;
                    this.client.logger.info(`> Plugin ${v.name} - ${dist.name} events added`);
                    if (!events[dist.name]) events[dist.name] = [];
                    events[dist.name]?.push({ run: dist.execute, plugin_name: v.name});
                }
            } catch (e) {
                this.client.logger.warn(`> Fail on loading events in ${v.name} plugin`, e)
            }
        });

        Object.entries(events).forEach(([k, v]) => {
            this.client.on(k, (...args) => {
                v.forEach(x => {
                    x.run(this.client, this.client.plugins[x.plugin_name as PluginsNames], ...args);
                })
            })
        })
    }
}