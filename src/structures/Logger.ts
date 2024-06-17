import {DBMClient} from "./DBMClient";
import {LoggerLevels} from "./typings/LoggerLevels";

export class Logger {
    private client: DBMClient;
    public constructor(client: DBMClient) {
        this.client = client;
    }

    public trace(...messages: unknown[]): void {
        this.write(LoggerLevels.TRACE, ...messages);
    }
    public debug(...messages: unknown[]): void {
        this.write(LoggerLevels.DEBUG, ...messages);
    }
    public info(...messages: unknown[]): void {
        this.write(LoggerLevels.INFO, ...messages);
    }
    public warn(...messages: unknown[]): void {
        this.write(LoggerLevels.WARN, ...messages);
    }
    public error(...messages: unknown[]): void {
        this.write(LoggerLevels.ERROR, ...messages);
    }
    public fatal(...messages: unknown[]): void {
        this.write(LoggerLevels.FATAL, ...messages);
    }

    private write(level: LoggerLevels,...messages: unknown[]): void {
        console.log(`[${Logger.FormatDate()}] ${level}:`,...messages);
    }

    public static FormatDate(date: Date = new Date()): string {
        return `${date.getMonth()}.${date.getDate()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
}