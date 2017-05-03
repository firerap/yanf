export interface ILogger {
    info(any): void;
    verbose(any): void;
    debug(any): void;
    warn(any): void;
    error(any): void;
}