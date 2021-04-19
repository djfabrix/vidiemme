import { Request, Response, Router } from "express";
import { IController } from "../common/interfaces/controller.interface";
import { EmployeeService } from "./employee.service";
import { LoggerManager } from "../common/logger";
import { Logger } from "winston";
import { validationMiddleware } from "../middleware/validation.middleware";
import { EmployeeDto, UpdateEmployeeDto } from "./employee.dto";
import { employeeSchema, updateEmployeeSchema } from "./validation/employee.schema";
import { Pagination } from "../common/interfaces/pagination.inferface";
import { Employee } from "./employee.model";
import { Task } from "../task/task.model";
import { HttpException } from "../exceptions/http.exception";

/**
 *
 * Responsible for handling incoming requests and returning responses to the client.
 *
 * IController class that exposes all the routes that implement CRUD operations for the Employee entity
 *
 * Root REST path for this controller is '/employee'
 *
 * @class EmployeeController
 */
export class EmployeeController implements IController {

    /**
     *  REST endpoint
     *  @public
     */
    public path: string = '/employee';

    /**
     *  Express router
     *  @public
     */
    public router: Router = Router();

    /**
     *  Employee Service
     *  @private
     */
    private employeeService: EmployeeService;

    /**
     *  Winston Service
     *  @private
     */
    private logger: Logger;

    /**
     * Instantiate the logger, the EmployeeService and initialize routes
     * @constructor
     */
    constructor() {
        this.logger = LoggerManager.getLogger();
        this.employeeService = new EmployeeService();
        this.initializeRoutes();
    }

    /**
     * Initialize controller routes.
     *
     * - GET: /employee         get list of all employees
     * - GET: /employee/:id     get a single employee
     * - GET: /employee/:id/tasks     get list of all employee's tasks
     * - POST: /employee        create a new employee
     * - PUT:  /employee/:id       update an employee
     * - DELETE:  /employee/:id    delete an employees (soft delete)
     *
     * Assign validation middleware for the requires routes
     * @private
     */
    private initializeRoutes() {

        this.router.get(`${this.path}`, this.getEmployeeList);
        this.router.get(`${this.path}/:id`, this.getEmployeeById);
        this.router.get(`${this.path}/:id/tasks`, this.retrieveEmployeeTasks);
        this.router.post(`${this.path}`, validationMiddleware(employeeSchema), this.createEmployee);
        this.router.put(`${this.path}/:id`, validationMiddleware(updateEmployeeSchema), this.updateEmployee);
        this.router.delete(`${this.path}/:id`, this.deleteEmployee);
    }

    /**
     *
     * Handle employee creation request.
     *
     * If employee creation is successful:
     * - Return created employee json representation (HTTP code 200)
     *
     * If employee creation fails:
     * - Return json object error property containing error message (HTTP code 500)
     *
     * @param {Request} req  Http Request object
     * @param {Response} res Http Response object
     * @private
     */
    private createEmployee = async (req: Request, res: Response) => {
        try {
            const employeeDto: EmployeeDto = req.body;
            const employee: Employee = await this.employeeService.createEmployee(employeeDto);

            res.status(200).send(employee);
        }
        catch (e) {
            this.logger.error(e.message);
            res.status(500).json({
                error: e.message
            });
        }
    }

    /**
     *
     * Handle employee update request.
     *
     * Perform validation on hiring and dismissal date.
     *
     * If employee creation is successful:
     * - Return created employee json representation (HTTP code 200)
     *
     * If employee creation fails:
     * - Return json object error property containing error message (HTTP code 500)
     * @param {Request} req  Http Request object
     * @param {Response} res Http Response object
     * @private
     */
    private updateEmployee = async (req: Request, res: Response) => {
        try {

            const employeeSn: string = req.params.id;
            const employeeDto: UpdateEmployeeDto = req.body;

            const isValidaDate: boolean = await this.employeeService.validateHiringDismissalDate(employeeSn, employeeDto.hiring_date, employeeDto.dismissal_date);

            if (!isValidaDate) {
                throw new HttpException(500, `Dismissal date cannot be greater than hiring date`);
            }

            const employee:Employee =  await this.employeeService.updateEmployee(employeeDto, employeeSn);
            res.status(200).json(employee ? employee : {});
        }
        catch (e) {
            this.logger.error(e.message);
            res.status(500).json({
                error: e.message
            });
        }
    }

    /**
     *
     * Handle employee delete request.
     *
     * Perform a soft-delete
     *
     * Employee with active (not deleted) tasks associated cannot be deleted.
     *
     * If employee deletion is successful:
     * - Return empty json object (HTTP code 200)
     *
     * If employee deletion fails:
     * - Return json object error property containing error message (HTTP code 500)
     * @param {Request} req  Http Request object
     * @param {Response} res Http Response object
     * @private
     */
    private deleteEmployee = async (req: Request, res: Response) => {
        try {
            const employeeSn: string = req.params.id;
            await this.employeeService.deleteEmployee(employeeSn);
            res.status(200).json({});
        }
        catch (e) {
            this.logger.error(e.message);
            res.status(500).json({
                error: e.message
            });
        }
    }

    /**
     *
     * Handle employee list request. Search for all employees in database
     *
     * The response list can be paginated passing the following parameters in querystring:
     * - limit: the number of rows returned
     * - offset: the number of rows omitted before the beginning
     *
     * If request is successful:
     * - Return list of employee json representation or an empty list (HTTP code 200)
     *
     * If request fails:
     * - Return json object error property containing error message (HTTP code 500)
     * @param {Request} req  Http Request object
     * @param {Response} res Http Response objectp Response object
     * @private
     */
    private getEmployeeList = async (req: Request, res: Response) => {
        try {
            const {offset, limit} = req.query;

            const pagination: Pagination = {
                offset: Number(offset),
                limit: Number(limit)
            };

            let employeeList: Employee[] = await this.employeeService.getEmployeeList(pagination);
            return res.status(200).send(employeeList);
        }
        catch (e) {
            this.logger.error(e.message);
            res.status(500).json({
                error: e.message
            });
        }
    }

    /**
     *
     * Handle find employee request. Search for one employee in database, with the specified serial number
     *
     * If request is successful:
     * - Return employee json representation or an empty object (HTTP code 200)
     *
     * If request fails:
     * - Return json object error property containing error message (HTTP code 500)
     * @param {Request} req  Http Request object
     * @param {Response} res Http Response object
     * @private
     */
    private getEmployeeById = async (req: Request, res: Response) => {
        try {
            const employeeSn: string = req.params.id;
            let employee: Employee = await this.employeeService.getEmployeeById(employeeSn);
            return res.status(200).send(employee ? employee : {});
        }
        catch (e) {
            this.logger.error(e.message);
            res.status(500).json({
                error: e.message
            });
        }
    }

    /**
     *
     * Handle employee's task list request. Search for all the task assigned to a single employee in database, with the specified serial number
     *
     * The response list can be paginated passing the following parameters in querystring:
     * - limit: the number of rows returned
     * - offset: the number of rows omitted before the beginning
     *
     * If request is successful:
     * - Return list of task json representation or an empty list (HTTP code 200)
     *
     * If request fails:
     * - Return json object error property containing error message (HTTP code 500)
     * @param {Request} req  Http Request object
     * @param {Response} res Http Response object
     * @private
     */
    private retrieveEmployeeTasks = async (req: Request, res: Response) => {
        try {
            const employeeSn = req.params.id;

            const {offset, limit} = req.query;

            const pagination: Pagination = {
                offset: Number(offset),
                limit: Number(limit)
            };

            const employeeTaskList: Task[] = await this.employeeService.retrieveEmployeeTasks(pagination, employeeSn);
            return res.status(200).send(employeeTaskList);
        }
        catch (e) {
            this.logger.error(e.message);
            res.status(500).json({
                error: e.message
            });
        }

    }

}
