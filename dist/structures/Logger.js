"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const LoggerLevels_1 = require("./typings/LoggerLevels");
class Logger {
    constructor(client) {
        this.client = client;
    }
    trace(...messages) {
        this.write(LoggerLevels_1.LoggerLevels.TRACE, ...messages);
    }
    debug(...messages) {
        this.write(LoggerLevels_1.LoggerLevels.DEBUG, ...messages);
    }
    info(...messages) {
        this.write(LoggerLevels_1.LoggerLevels.INFO, ...messages);
    }
    warn(...messages) {
        this.write(LoggerLevels_1.LoggerLevels.WARN, ...messages);
    }
    error(...messages) {
        this.write(LoggerLevels_1.LoggerLevels.ERROR, ...messages);
    }
    fatal(message, error) {
        this.write(LoggerLevels_1.LoggerLevels.FATAL, message);
        if (error)
            throw error;
    }
    write(level, ...messages) {
        console.log(`[${Logger.FormatDate()}] ${LoggerLevels_1.LoggerLevels[level]}:`, ...messages);
    }
    static FormatDate(date = new Date()) {
        return `${date.getMonth()}.${date.getDate()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
}
exports.Logger = Logger;
