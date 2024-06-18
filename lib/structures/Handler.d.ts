import { DBMClient } from "./DBMClient";
import { SlashCommands } from "./Handler/SlashCommands";
import { Events } from "./Handler/Events";
import { Components } from "./Handler/Components";
export declare class Handler {
    private readonly client;
    slashcommands: SlashCommands | undefined;
    events: Events | undefined;
    components: Components | undefined;
    constructor(client: DBMClient);
    init(): Promise<void>;
    static getPathsFiles(dir: string): string[];
}
