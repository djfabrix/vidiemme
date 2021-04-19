import express, { Application } from 'express';
import { Logger } from 'winston';
import { settings } from "./config/settings";
import { IController } from "./common/interfaces/controller.interface";
import { LoggerManager } from "./common/logger";
import bodyParser from "body-parser";
import { typeOrmConfig } from "./config/connection";
import { createConnection } from "typeorm";
import swaggerUi from "swagger-ui-express";
import jsonStringifyDate from 'json-stringify-date';



/**
 * Server class is a wrapper for Express app.
 * @class
 */
export class Server {
    public app: Application;
	public logger!: Logger;

    /**
     * Initialize Express app
     * Set bodyParser.
     * Create logger
     * Initialize controllers routes
     * @constructor
     * @param {IController[]} controllers Array on app controller instances
     */
    constructor(controllers: IController[]) {
        this.app = express();
        this.app.use(bodyParser.json({reviver: jsonStringifyDate.getReviver()}));
        this.app.set('json replacer', jsonStringifyDate.getReplacer());
        this.app.use(express.static("public"));
        this.app.use(express.static("tsdocs"));
        this.app.use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(undefined, {
                swaggerOptions: {
                    url: "/swagger.json",
                },
            })
        );

        this.createLogger();
        this.initializeControllers(controllers);
    }

    /**
     * Connect to mysql database with TypeORM framework and start Express server.
     *
     */
    public listen() {
        createConnection(typeOrmConfig).then(() => {
            this.app.listen(settings.PORT, () => {
                this.logger.info(`App listening on the port ${settings.PORT}`);
            });
        })
    }

    /**
     * Create Winston logger with console transport and debug level.
     * @private
     */
    private createLogger() {
        this.logger = LoggerManager.getLogger();
    }

    /**
     * Initialize the controller, assigning router to express app
     * @param controllers
     * @private
     */
    private initializeControllers(controllers: IController[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
}
