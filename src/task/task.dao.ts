import { Logger } from "winston";
import { LoggerManager } from "../common/logger";
import { TaskDto } from "./task.dto";
import { getConnection, getRepository, SelectQueryBuilder, UpdateResult } from "typeorm";
import { Task } from "./task.model";
import { Pagination } from "../common/interfaces/pagination.inferface";
import { EmployeeDao } from "../employee/employee.dao";
import { HttpException } from "../exceptions/http.exception";
import { plainToClass } from "class-transformer";

/**
 * Singleton class TaskDao.
 * This class is responsible of the database access for the task domain data
 * @class EmployeeDao
 */
export class TaskDao {

    /**
     * The singleton instance
     * @static
     * @private
     */
    private static instance: TaskDao;

    /**
     * The EmployeeDao
     * @private
     */
    private employeeDao: EmployeeDao;

    /**
     * Winston logger instance
     * @private
     */
    private logger: Logger;

    /**
     * Instantiate the Winston Logger and the EmployeeDao
     * @constructor
     * @private
     */
    private constructor() {
        this.logger = LoggerManager.getLogger();
        this.employeeDao = EmployeeDao.getInstance();
    }

    /**
     * Return the existing class instance or instantiate a new one if not exists.
     * @static
     */
    public static getInstance(): TaskDao {
        if (!TaskDao.instance) {
            TaskDao.instance = new TaskDao();
        }

        return TaskDao.instance;
    }

    /**
     * Query the database for the task with id provided.
     * @async
     * @param {number} taskId The employee id
     * @return {Promise<Task> | undefined} The task object. undefined if not found.
     * @throws exception is thrown if fails.
     */
    public async findOneTask(taskId: number): Promise<Task> {
        try {
            return await this.createSelectQueryBuilder()
                .where("task.id = :taskId", { taskId: taskId })
                .getOne();
        }
        catch (e) {
            throw e;
        }

    }

    /**
     * Query the database for the list of all tasks, with pagination options
     *
     * If employee serial number is provided, search for all tasks of the employee with serial number specified.
     * @async
     * @param {Pagination} pagination pagination options
     * @param {string} (optional) employeeSn employee's serial number
     * @return {Promise<Task[]>} The list of tasks
     * @throws exception is thrown if fails.
     */
    public async findAllTasks(pagination: Pagination, employeeSn?:string): Promise<Task[]> {
        try {
            let qb = this.createSelectQueryBuilder();

            if (pagination && pagination.limit) {
                qb.take(pagination.limit);
            }

            if (pagination && pagination.offset) {
                qb.skip(pagination.offset)
            }

            if (employeeSn) {
                qb.where("task.employee = :employeeSn", {employeeSn: employeeSn});
            }

            return await qb.getMany();
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Query the database for task creation
     * @async
     * @param {TaskDto} taskToCreate object representing the Task to create
     * @return {Promise<Task>} The created task
     * @throws exception is thrown if fails.
     */
    public async createTask(taskToCreate: TaskDto): Promise<Task> {
        try {
            const taskRepository = getRepository(Task);
            let task:Task = plainToClass(Task, taskToCreate);
            //await this.checkAndAssignEmployee(task, taskToCreate);
            return await taskRepository.save(task);
        }
        catch (e) {
            if (e.errno == 1452) {
                throw new HttpException(500, `Employee with serial number ${taskToCreate.employee} does not exists.`);
            }
            throw e;
        }
    }

    /**
     * Query the database for task update
     * @async
     * @param {TaskDto} taskToUpdate object representing the Task with properties to update
     * @param {number} taskId theid of the task to update
     * @return {Promise<Task | undefined>} The updated task or undefined
     * @throws exception is thrown if fails.
     */
    public async updateTask(taskToUpdate: TaskDto, taskId: number): Promise<Task> {
        try {
            let task:Task = plainToClass(Task, taskToUpdate);
            //await this.checkAndAssignEmployee(task, taskToUpdate);

            await getConnection()
                .createQueryBuilder()
                .update(Task)
                .set(task)
                .where("id = :taskId", {taskId: taskId })
                .andWhere("deletedAt IS NULL")
                .execute();

            return await this.findOneTask(taskId);
        }
        catch (e) {
            if (e.errno == 1452) {
                throw new HttpException(500, `Employee with serial number ${taskToUpdate.employee} does not exists.`);
            }
            throw e;
        }
    }

    /**
     * Query the database for task soft-delete
     * @async
     * @param {number} taskId id of the task to update
     * @return {Promise<UpdateResult>} Result object returned by UpdateQueryBuilder execution.
     * @throws exception is thrown if fails.
     */
    public async deleteTask(taskId: number): Promise<UpdateResult> {
       try {
           return await getConnection()
               .createQueryBuilder()
               .softDelete()
               .from(Task)
               .where("id = :taskId", { taskId: taskId })
               // .andWhere("deleteAt is not null")
               .execute();
       }
       catch (e) {
           throw e;
       }
    }

    /**
     * Create TypeORM query builder object for Task entity
     * @return {SelectQueryBuilder<Task>} query builder object
     * @private
     */
    private createSelectQueryBuilder(): SelectQueryBuilder<Task> {
        try {
            return getConnection()
                .getRepository(Task)
                .createQueryBuilder("task");
        }
        catch (e) {
            throw e;
        }
    }

    /**
     *
     * If taskDto contains the employeee property, check if employee exists on database and assign it to Task entity.
     *
     * @param task {Task} the Task Entity
     * @param taskDto {TaskDto} the TaskDto Object with properties to update
     * @throws HttpException if employee does not exists on database
     */
    /*
    private async checkAndAssignEmployee(task: Task, taskDto: TaskDto) {
        if (taskDto.employee) {
            const employee = await this.employeeDao.findOneEmployee(taskDto.employee);
            if (!employee) throw new HttpException(500, `Employee with serial number ${task.employee} does not exists.`);
            task.employee = employee;
        }
    }
    */
}
