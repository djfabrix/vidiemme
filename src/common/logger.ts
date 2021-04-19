import winston, { Logger } from "winston";

export class LoggerManager {

    private static logger: Logger;

    constructor() {

        const loggerFormat = winston.format.printf(({ level, message, label, timestamp, ...metadata }) => {
            return `${timestamp} [${label}] ${level}: ${message}`;
        });

        LoggerManager.logger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.label({label: '' }),
                        winston.format.timestamp(),
                        loggerFormat
                    )
                }),
            ],
            exitOnError: false,
        });
    }

    /**
     * @return singleton instance of winston logger
     */
    public static getLogger(): Logger {

        if (!this.logger) {
            new this();
        }

        return this.logger;
    }
}
