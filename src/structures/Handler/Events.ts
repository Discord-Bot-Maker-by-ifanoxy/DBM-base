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
        let events: { [k in keyof ClientEvents]?: any[]} = {};
        this.client.config.plugins.forEach(v => {
            try {
                const eventsPath = Handler.getPathsFiles(`./plugins/${v.name}/events`);
                for (let path of eventsPath)
                {
                    const dist = require('../../../' + path) as EventFile;
                    this.client.logger.info(`> Plugin ${v.name} - ${events[dist.name]} events added`);
                    if (!events[dist.name]) events[dist.name] = [];
                    events[dist.name]?.push(dist.execute);
                }
            } catch {
                this.client.logger.warn(`> Fail on loading events in ${v.name} plugin`)
            }
        });
    }
}