import {DBMClient} from "./DBMClient";
import * as fs from "fs";
import {SlashCommands} from "./Handler/SlashCommands";
import {Events} from "./Handler/Events";

export class Handler {
    private readonly client: DBMClient;
    public slashcommands: SlashCommands | undefined;
    public events: Events | undefined;
    public constructor(client: DBMClient) {
        this.client = client;
    }
    public async init() {
        this.slashcommands = new SlashCommands(this.client);
        this.events = new Events(this.client);
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