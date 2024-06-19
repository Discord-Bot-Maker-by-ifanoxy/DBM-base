import {Handler} from "../Handler";
import {Collection} from "discord.js";
import {SlashCommandFile} from "../typings/SlashCommandFile";
import {DBMClient} from "../DBMClient";
import {PluginsNames} from "../typings/PluginsNames";

export class SlashCommands {
    private client: DBMClient;
    public data: Collection<string, SlashCommandFile>;
    constructor(client: DBMClient) {
        this.client = client;
        this.data = new Collection();
        this.loadSlashCommands();
        this.client.once('ready', e => e.application.commands.set(this.data.map(x => x.builder.toJSON())))
    }

    public loadSlashCommands() {
        this.client.logger.info('Loading Slashcommands')
        let commandsPath: [PluginsNames, string[]][] = [];
        this.client.config.plugins.map(x => this.client.plugins[x].config).filter(x => x?.commandsDir).forEach(v => {
            try {
                const commands = Handler.getPathsFiles(`./plugins/${v.name}/dist/${v.commandsDir}`);
                this.client.logger.info(`> Plugin ${v.name} - ${commands.length} slashcommands added`);
                commandsPath.push([v.name, commands]);
            } catch {
                this.client.logger.warn(`> Fail on loading slashcommands in ${v.name} plugin`)
            }
        });

        for (let plugin of commandsPath)
        {
            for (let path of plugin[1])
            {
                const dist = require('../../../' + path).default as SlashCommandFile;
                this.data.set(dist.builder.name, {...dist, plugin_name: plugin[0] });
            }
        }
    }
}