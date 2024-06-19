import {DBMClient} from "./DBMClient";
import {Sequelize} from "sequelize";
import {createConnection} from "mysql2/promise";

export class Database extends Sequelize {
    private client: DBMClient;
    constructor(client: DBMClient) {
        super({
            dialect: 'mysql',
            database: client.config.database.name,
            host: client.config.database.host,
            port: client.config.database.port,
            username: client.config.database.username,
            password: client.config.database.password,
            logging: (msg) => client.logger.trace("Database query", msg)
        })
        this.client = client;
    }

    public static async createDatabase(database: { name: string, host: string, port: number, username: string, password: string}) {
        return (await createConnection({
            host: database.host,
            port: database.port,
            user: database.username,
            password: database.password,
        })).query(`CREATE DATABASE IF NOT EXISTS \`${database.name}\`;`);
    }

    async connect() {
        try {
            await this.authenticate();
            this.client.logger.info("Database connected");
        } catch (e) {
            this.client.logger.fatal("Database configuration is incorrect! Check config.json", new Error(JSON.stringify(e, null, 2)));
        }
    }
}