"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const sequelize_1 = require("sequelize");
class Database extends sequelize_1.Sequelize {
    constructor(client) {
        super({
            dialect: 'mysql',
            host: client.config.database.host,
            port: client.config.database.port,
            username: client.config.database.username,
            password: client.config.database.password,
            logging: (msg) => client.logger.trace("Database query", msg)
        });
        this.client = client;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authenticate();
                yield this.query(`CREATE DATABASE IF NOT EXISTS \`${this.client.config.database.name}\`;`);
                this.client.logger.info("Database connected");
            }
            catch (e) {
                this.client.logger.fatal("Database configuration is incorrect! Check config.json", new Error(JSON.stringify(e, null, 2)));
            }
        });
    }
}
exports.Database = Database;
