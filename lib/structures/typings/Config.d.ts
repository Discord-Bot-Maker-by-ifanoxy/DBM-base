import { LoggerLevels } from "./LoggerLevels";
import { PluginsNames } from "./PluginsNames";
export interface Config {
    client: {
        token: string;
    };
    plugins: PluginsNames[];
    logger_levels: LoggerLevels;
    database: {
        name: string;
        host: string;
        port: number;
        username: string;
        password: string;
    };
}
