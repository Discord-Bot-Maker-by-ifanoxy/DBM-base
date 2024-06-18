import { DBMClient } from "./DBMClient";
import { Sequelize } from "sequelize";
export declare class Database extends Sequelize {
    private client;
    constructor(client: DBMClient);
    connect(): Promise<void>;
}
