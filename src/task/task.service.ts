import { TaskDao } from "./task.dao";
import { TaskDto } from "./task.dto";
import { Task } from "./task.model";
import { Pagination } from "../common/interfaces/pagination.inferface";
import { UpdateResult } from "typeorm";

/**
 * Service class for Task
 * @class
 */
export class TaskService {

    /**
     * Task Dao
     * @private
     */
    private taskDao: TaskDao;

    /**
     * Instantiates singleton of Task Dao
     * @constructor
     */
    constructor() {
        this.taskDao = TaskDao.getInstance();
    }

    /**
     * Call the TaskDao for creating Task
     *
     * @async
     * @param {TaskDto} taskDto TaskDto object representing the Task to create
     * @return {Promise<Task>} the created task
     * @throws
     * exception is thrown if task creation fails.
     */
    public async createTask(taskDto: TaskDto): Promise<Task> {
        try {
            const task = await this.taskDao.createTask(taskDto);
            return task;
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Call the TaskDao for updating Task
     *
     * @async
     * @param {TaskDto} taskDto TaskDto object representing the Task with properties to update
     * @param {number} taskId id of the task to update
     * @return {Promise<Task>} the updated task
     * @throws
     * exception is thrown if employee update fails.
     */
    public async updateTask(taskDto: TaskDto, taskId: number): Promise<Task> {
        try {
            return await this.taskDao.updateTask(taskDto, taskId);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Call the TaskDao for soft-delete Task.
     *
     * @async
     * @param {number} taskId id of the task to delete
     * @return {Promise<UpdateResult>} Result object returned by UpdateQueryBuilder execution.
     * @throws
     * exception is thrown if employee update fails.
     */
    public async deleteTask(taskId: number): Promise<UpdateResult> {
        try {
            return await this.taskDao.deleteTask(taskId);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Call the TaskDao for searching all the tasks
     *
     * @async
     * @param {Pagination} pagination Pagination configuration
     * @return {Promise<Task[]>} List of all the tasks
     * @throws
     * exception is thrown if search fails.
     */
    public async getTaskList(pagination: Pagination): Promise<Task[]> {
        try {
            return await this.taskDao.findAllTasks(pagination);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Call the TaskDao for searching a specific task by id
     *
     * @async
     * @param {number} taskId The id of the task to search
     * @return {Promise<Task>} the task entity or undefined
     * @throws
     * exception is thrown if search fails.
     */
    public async getTaskById(taskId: number): Promise<Task> {
        try {
            return await this.taskDao.findOneTask(taskId);
        }
        catch (e) {
            throw e;
        }
    }

}
