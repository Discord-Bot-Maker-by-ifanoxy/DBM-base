import {DBMClient} from "./DBMClient";
import * as fs from "fs";
import {SlashCommands} from "./Handler/SlashCommands";
import {Events} from "./Handler/Events";
import {Components} from "./Handler/Components";

export class Handler {
    private readonly client: DBMClient;
    public slashcommands: SlashCommands | undefined;
    public events: Events | undefined;
    public components: Components | undefined;
    public constructor(client: DBMClient) {
        this.client = client;
    }
    public async init() {
        this.slashcommands = new SlashCommands(this.client);
        this.events = new Events(this.client);
        this.components = new Components(this.client);
    }

    public static getPathsFiles(dir: string): string[] {
        let paths: string[] = [];
        for (let file of fs.readdirSync(dir))
        {
            if (file.includes('.'))
            {
                paths.push(dir + '/' + file);
            } else {
                paths.concat(Handler.getPathsFiles(dir + '/' + file));
            }
        }
        return paths;
    }
}