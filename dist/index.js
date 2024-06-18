"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBMClient_1 = require("./structures/DBMClient");
const config = require("../config.json");
new DBMClient_1.DBMClient(DBMClient_1.DBMClient.extractIntents(config), config);
