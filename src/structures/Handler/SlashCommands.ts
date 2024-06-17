import {Handler} from "../Handler";
import {Collection} from "discord.js";
import {SlashCommandFile} from "../typings/SlashCommandFile";
import {DBMClient} from "../DBMClient";

export class SlashCommands {
    private client: DBMClient;
    public data: Collection<string, SlashCommandFile>;
    constructor(client: DBMClient) {
        this.client = client;
        this.data = new Collection();
        this.loadSlashCommands();
    }

    public loadSlashCommands() {
        this.client.logger.info('Loading Slashcommands')
        let commandsPath: string[] = [];
        this.client.config.plugins.forEach(v => {
            try {
                const commands = Handler.getPathsFiles(`./plugins/${v.name}/slashcommands`);
                this.client.logger.info(`> Plugin ${v.name} - ${commands.length} slashcommands added`);
                commandsPath.concat(commands);
            } catch {
                this.client.logger.warn(`> Fail on loading slashcommands in ${v.name} plugin`)
            }
        });

        for (let path of commandsPath)
        {
            const dist = require('../../../' + path) as SlashCommandFile;
            this.data.set(dist.builder.name, dist);
        }
    }
}