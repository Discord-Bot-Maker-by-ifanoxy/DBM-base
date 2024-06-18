import { DBMClient } from "./DBMClient";
export declare class Logger {
    private client;
    constructor(client: DBMClient);
    trace(...messages: unknown[]): void;
    debug(...messages: unknown[]): void;
    info(...messages: unknown[]): void;
    warn(...messages: unknown[]): void;
    error(...messages: unknown[]): void;
    fatal(message: string, error?: Error): void;
    private write;
    static FormatDate(date?: Date): string;
}
