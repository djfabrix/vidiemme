import { IController } from "../common/interfaces/controller.interface";
import { Request, Response, Router } from "express";
import { LoggerManager } from "../common/logger";
import { TaskService } from "./task.service";
import { validationMiddleware } from "../middleware/validation.middleware";
import { createTaskSchema, updateTaskSchema } from "./validation/task.schema";
import { TaskDto } from "./task.dto";
import { Pagination } from "../common/interfaces/pagination.inferface";
import { Task } from "./task.model";
import { Logger } from "winston";

/**
 *
 * Responsible for handling incoming requests and returning responses to the client.
 *
 * IController class that exposes all the routes that implement CRUD operations for the Task entity
 *
 * Root REST path for this controller is '/task'
 *
 * @class TaskController
 */
export class TaskController implements IController {

    /**
     *  REST endpoint
     *  @public
     */
    public path = '/task';

    /**
     *  Express router
     * @public
     */
    public router = Router();

    /**
     *  Task Service
     *  @private
     */
    private taskService: TaskService;

    /**
     *  Winston Service
     *  @private
     */
    private logger: Logger;

    /**
     * Instatiate the logger, the TaskService and initialize routes
     * @constructor
     */

    constructor() {
        this.logger = LoggerManager.getLogger();
        this.taskService = new TaskService();
        this.initializeRoutes();
    }

    /**
     * Initialize controller routes.
     *
     * The following routes are exposed:
     * - GET: /task         get list of all tasks
     * - GET: /task/:id     get a single task
     * - POST: /task        create a new task
     * - PUT:  /task/:id       update a task
     * - DELETE:  /task/:id    delete a task (soft delete)
     *
     * Assign validation middleware for the requires routes
     * @private
     */
    private initializeRoutes() {
        this.router.get(`${this.path}`, this.getTaskList);
        this.router.get(`${this.path}/:id`, this.getTaskById);
        this.router.post(`${this.path}`, validationMiddleware(createTaskSchema), this.createTask);
        this.router.put(`${this.path}/:id`, validationMiddleware(updateTaskSchema), this.updateTask);
        this.router.delete(`${this.path}/:id`, this.deleteTask);
    }

    /**
     *
     * Handle task creation request.
     *
     * If task creation is successfull:
     * - Return created task json representation (HTTP code 200)
     *
     * If task creation fails:
     * - Return json object error property containing error message (HTTP code 500)
     *
     * @param {Request} req  Http Request object
     * @param {Response} res Http Response object
     * @private
     */
    private createTask = async (req: Request, res: Response) => {
        try {
            const taskDto: TaskDto = req.body;
            const task = await this.taskService.createTask(taskDto);
            res.status(200).json(task);
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
     * Handle task update request.
     *
     * If task creation is successfull:
     * - Return created task json representation (HTTP code 200)
     *
     * If task creation fails:
     * - Return json object error property containing error message (HTTP code 500)
     * @param {Request} req  Http Request object
     * @param {Response} res Http Response object
     * @private
     */
    private updateTask = async (req: Request, res: Response) => {
        try {
            const taskId: number = Number(req.params.id);
            const taskDto: TaskDto = req.body;
            const task:Task = await this.taskService.updateTask(taskDto, taskId);
            res.status(200).json(task ? task : {});
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
     * Handle task delete request.
     *
     * Perform a soft-delete
     *
     * If task deletion is successfull:
     * - Return empty json object (HTTP code 200)
     *
     * If task deletion fails:
     * - Return json object error property containing error message (HTTP code 500)
     * @param {Request} req  Http Request object
     * @param {Response} res Http Response object
     * @private
     */
    private deleteTask = async (req: Request, res: Response) => {
        try {
            const taskId: number = Number(req.params.id);
            await this.taskService.deleteTask(taskId);
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
     * Handle task list request .Search for all tasks in database
     *
     * The response list can be paginated passing the following parameters in querystring:
     * - limit: the number of rows returned
     * - offset: the number of rows omitted before the beginning
     *
     * If request is successful:
     * - Return list of task json representation or and empty list (HTTP code 200)
     *
     * If request fails:
     * - Return json object error property containing error message (HTTP code 500)
     * @param {Request} req  Http Request object
     * @param {Response} res Http Response object
     * @private
     */
    private getTaskList = async (req: Request, res: Response) => {
        try {
            const {offset, limit} = req.query;

            const pagination: Pagination = {
                offset: Number(offset),
                limit: Number(limit)
            };

            let taskList: Task[] = await this.taskService.getTaskList(pagination)
            return res.status(200).send(taskList);
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
     * Handle find task request. Search for one task in database, with the specified id
     *
     * If request is successful:
     * - Return task json representation or an empty object (HTTP code 200)
     *
     * If request fails:
     * - Return json object error property containing error message (HTTP code 500)
     * @param {Request} req  Http Request object
     * @param {Response} res Http Response object
     * @private
     */
    private getTaskById = async (req: Request, res: Response) => {
        try {
            const taskId: number = Number(req.params.id);
            let task: Task = await this.taskService.getTaskById(taskId);
            return res.status(200).send(task ? task : {});
        }
        catch (e) {
            this.logger.error(e.message);
            res.status(500).json({
                error: e.message
            });
        }
    }
}
