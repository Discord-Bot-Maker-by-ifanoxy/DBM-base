import {DBMClient} from "./structures/DBMClient";
import {Config} from "./structures/typings/Config";
const config = require("../config.json") as Config;

new DBMClient(DBMClient.extractIntents(config), config);