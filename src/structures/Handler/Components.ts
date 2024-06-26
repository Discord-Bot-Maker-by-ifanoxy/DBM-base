import {Handler} from "../Handler";
import {Collection, ComponentType} from "discord.js";
import {DBMClient} from "../DBMClient";
import {ComponentFile} from "../typings/ComponentFile";
import {PluginsNames} from "../typings/PluginsNames";



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
        let componentsPath: [PluginsNames, string[]][] = [];
        this.client.config.plugins.map(x => this.client.plugins[x]?.config).filter(x => x?.componentsDir).forEach(v => {
            try {
                const components = Handler.getPathsFiles(`./plugins/${v.name}/dist/${v.componentsDir}`);
                this.client.logger.info(`> Plugin ${v.name} - ${components.length} components added`);
                componentsPath.push([v.name, components]);
            } catch {
                this.client.logger.warn(`> Fail on loading components in ${v.name} plugin`)
            }
        });

        for (let plugin of componentsPath)
        {
            for (let path of plugin[1]) {
                const dist = require('../../../' + path).default as ComponentFile;
                const type = this.data.get(ComponentType[dist.type] as keyof typeof ComponentType);
                type?.set(dist.customId, {...dist, plugin_name: plugin[0]});
            }
        }
    }
}