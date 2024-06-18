import { DBMClient } from "../DBMClient";
export declare class Events {
    private client;
    constructor(client: DBMClient);
    loadEvents(): void;
}
