require('./config/loadenv');
import { Server } from "./server";
import { EmployeeController } from "./employee/employee.controller";
import { TaskController } from "./task/task.controller";


/**
 * Instantiate and start the Application Server on the configured port
 */

const app = new Server([
    new EmployeeController(),
    new TaskController()
]);

app.listen();
