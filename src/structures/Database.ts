import {DBMClient} from "./DBMClient";
import {Sequelize} from "sequelize";

export class Database extends Sequelize {
    private client: DBMClient;
    constructor(client: DBMClient) {
        super({
            dialect: 'mysql',
            host: client.config.database.host,
            port: client.config.database.port,
            username: client.config.database.username,
            password: client.config.database.password,
            logging: (msg) => client.logger.trace("Database query", msg)
        })
        this.client = client;
    }

    async connect() {
        try {
            await this.authenticate();
            await this.query(`CREATE DATABASE IF NOT EXISTS \`${this.client.config.database.name}\`;`);
            this.client.logger.info("Database connected");
        } catch (e) {
            this.client.logger.fatal("Database configuration is incorrect! Check config.json", new Error(JSON.stringify(e, null, 2)));
        }
    }
}