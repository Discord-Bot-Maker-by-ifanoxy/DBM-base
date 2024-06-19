"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const sequelize_1 = require("sequelize");
const promise_1 = require("mysql2/promise");
class Database extends sequelize_1.Sequelize {
    client;
    constructor(client) {
        super({
            dialect: 'mysql',
            database: client.config.database.name,
            host: client.config.database.host,
            port: client.config.database.port,
            username: client.config.database.username,
            password: client.config.database.password,
            logging: (msg) => client.logger.trace("Database query", msg)
        });
        this.client = client;
    }
    static async createDatabase(database) {
        return (await (0, promise_1.createConnection)({
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
        }
        catch (e) {
            this.client.logger.fatal("Database configuration is incorrect! Check config.json", new Error(JSON.stringify(e, null, 2)));
        }
    }
}
exports.Database = Database;
