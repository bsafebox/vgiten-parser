import { ErrorCode } from './error-codes';
declare type LogLevel = string | number | undefined | null;
declare class Log {
    readonly version: string;
    name: string | undefined;
    storageKey: string | undefined;
    currentLevel: number;
    levels: {
        [name: string]: number;
    };
    static errors: typeof ErrorCode;
    static LogLevels: {
        [name: string]: number;
    };
    methodFactory: Function;
    constructor(name?: string, defaultLevel?: LogLevel, factory?: Function);
    getLevel(): number | string;
    trace(...args: Array<any>): void;
    debug(...args: Array<any>): void;
    info(...args: Array<any>): void;
    warn(...args: Array<any>): void;
    error(...args: Array<any>): void;
    setLevel(level: LogLevel, persist: boolean): any;
    setDefaultLevel(level: number | string): void;
}
declare const logger: Log;
export default logger;
//# sourceMappingURL=logger.d.ts.map