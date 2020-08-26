
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

import { Config } from './config';

interface LoggerInterface {
    info(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
    verbose(message: string): void;
}

export default class Logger implements LoggerInterface {
    private logger: WinstonLogger;

    private messageFormat = format.printf(({ level, message }) => {
        return `[${level}] ${message}`;
    });

    constructor() {
        this.logger = createLogger({
            format: this.messageFormat,
            level: Config.LOGGER_LEVEL,
            levels: Config.LOGGER_LEVELS,
            transports: [new transports.Console()]
        });
    }

    public error(message: any): void {
        this.logger.error(message);
    }

    public warn(message: any): void {
        this.logger.warn(message);
    }

    public info(message: any): void {
        this.logger.info(message);
    }

    public verbose(message: any): void {
        this.logger.verbose(message);
    }

    public debug(message: any): void {
        this.logger.debug(message);
    }
}