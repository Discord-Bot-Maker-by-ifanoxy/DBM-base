import {Handler} from "../Handler";
import {Collection, ComponentType} from "discord.js";
import {DBMClient} from "../DBMClient";
import {ComponentFile} from "../typings/ComponentFile";



export class Components {
    private client: DBMClient;
    public data: Collection<keyof typeof ComponentType, Collection<string, ComponentFile>>;
    constructor(client: DBMClient) {
        this.client = client;
        this.data = new Collection();
        Object.values(ComponentType).forEach(v => {
            this.data.set(v as keyof typeof ComponentType, new Collection<string, ComponentFile>())
        })
        this.loadComponents();
    }

    public loadComponents() {
        this.client.logger.info('Loading Components')
        let componentsPath: string[] = [];
        this.client.config.plugins.forEach(v => {
            try {
                const components = Handler.getPathsFiles(`./plugins/${v.name}/components`);
                this.client.logger.info(`> Plugin ${v.name} - ${components.length} components added`);
                componentsPath.concat(components);
            } catch {
                this.client.logger.warn(`> Fail on loading components in ${v.name} plugin`)
            }
        });

        for (let path of componentsPath)
        {
            const dist = require('../../../' + path) as ComponentFile;
            const type = this.data.get(ComponentType[dist.type] as keyof typeof ComponentType);
            type?.set(dist.customId, dist);
        }
    }
}