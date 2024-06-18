import {Handler} from "../Handler";
import {ClientEvents, Collection} from "discord.js";
import {SlashCommandFile} from "../typings/SlashCommandFile";
import {DBMClient} from "../DBMClient";
import {EventFile} from "../typings/EventFile";

export class Events {
    private client: DBMClient;
    constructor(client: DBMClient) {
        this.client = client;
        this.loadEvents();
    }

    public loadEvents() {
        this.client.logger.info('Loading events')
        let events: { [k in keyof ClientEvents]?: {run: any, plugin_name: string, embed_path: string }[]} = {};
        this.client.config.plugins.map(x => this.client.plugins[x]?.config).filter(x => x?.eventsDir).forEach(v => {
            try {
                const eventsPath = Handler.getPathsFiles(`./plugins/${v.name}/${v.eventsDir}`);
                for (let path of eventsPath)
                {
                    const dist = require('../../../' + path) as EventFile;
                    this.client.logger.info(`> Plugin ${v.name} - ${events[dist.name]} events added`);
                    if (!events[dist.name]) events[dist.name] = [];
                    events[dist.name]?.push({ run: dist.execute, embed_path: dist.embeds_path, plugin_name: v.name});
                }
            } catch {
                this.client.logger.warn(`> Fail on loading events in ${v.name} plugin`)
            }
        });

        Object.entries(events).forEach(([k, v]) => {
            this.client.on(k, (...args) => {
                v.forEach(x => {
                    const embed = require(`../../../plugins/${x.plugin_name}/${x.embed_path}`);
                    x.run(this.client, embed ?? {}, ...args);
                })
            })
        })
    }
}