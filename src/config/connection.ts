import { ConnectionOptions } from "typeorm";
import { Employee } from "../employee/employee.model";
import { Task } from "../task/task.model";

/**
 * Typeorm configuration.
 * @constant
 * @implements {ConnectionOptions}
 */

export const typeOrmConfig: ConnectionOptions = {
    /**
     * Database type.
     */
    type: "mysql",
    /**
     * Database host.
     */
    host: process.env.MYSQL_HOST,
    /**
     * Database host port.
     */
    port: Number(process.env.MYSQL_PORT),
    /**
     * Database username.
     */
    username: process.env.MYSQL_USER,
    /**
     * Database password.
     */
    password: process.env.MYSQL_PASSWORD,
    /**
     * Database name to connect to.
     */
    database: process.env.MYSQL_DB,
    /**
     * Entities to be loaded for this connection.
     */
    entities: [Employee, Task],
    /**
     * Indicates if database schema should be auto created on every application launch.
     */
    synchronize: true,
    /**
     * The timezone configured on the MySQL server.
     */
    timezone: 'Z'
};
