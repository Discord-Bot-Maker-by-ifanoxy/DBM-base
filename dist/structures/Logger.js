"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const LoggerLevels_1 = require("./typings/LoggerLevels");
class Logger {
    client;
    constructor(client) {
        this.client = client;
    }
    formatParagraph(x) {
        return typeof x == 'string' ? x.replaceAll('\n', `\n[${Logger.FormatDate()}]`) : x;
    }
    trace(...messages) {
        this.write(LoggerLevels_1.LoggerLevels.TRACE, ...messages.map(this.formatParagraph));
    }
    debug(...messages) {
        this.write(LoggerLevels_1.LoggerLevels.DEBUG, ...messages.map(this.formatParagraph));
    }
    info(...messages) {
        this.write(LoggerLevels_1.LoggerLevels.INFO, ...messages.map(this.formatParagraph));
    }
    warn(...messages) {
        this.write(LoggerLevels_1.LoggerLevels.WARN, ...messages.map(this.formatParagraph));
    }
    error(...messages) {
        this.write(LoggerLevels_1.LoggerLevels.ERROR, ...messages.map(this.formatParagraph));
    }
    fatal(message, error) {
        this.write(LoggerLevels_1.LoggerLevels.FATAL, this.formatParagraph(message));
        if (error)
            throw error;
    }
    write(level, ...messages) {
        if (this.client.config.logger_levels > level)
            return;
        console.log(`[${Logger.FormatDate()}] ${LoggerLevels_1.LoggerLevels[level]}:`, ...messages);
    }
    static FormatDate(date = new Date()) {
        return `${date.getMonth()}.${date.getDate()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
}
exports.Logger = Logger;
