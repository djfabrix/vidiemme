import { EmployeeDao } from "./employee.dao";
import { Employee } from "./employee.model";
import { EmployeeDto, UpdateEmployeeDto } from "./employee.dto";
import { Pagination } from "../common/interfaces/pagination.inferface";
import { TaskDao } from "../task/task.dao";
import { Task } from "../task/task.model";
import { HttpException } from "../exceptions/http.exception";
import { UpdateResult } from "typeorm";

/**
 * Service class for Employee
 * @class
 */
export class EmployeeService {

    /**
     * Employee Dao
     * @private
     */
    private employeeDao: EmployeeDao;

    /**
     * Task Dao
     * @private
     */
    private taskDao: TaskDao;

    /**
     * Instantiates singleton of Employee and Task Dao
     * @constructor
     */
    constructor() {
        this.employeeDao = EmployeeDao.getInstance();
        this.taskDao = TaskDao.getInstance();
    }

    /**
     * Call the EmployeeDao for creating Employee.
     *
     * @async
     * @param {EmployeeDto} employeeToCreate EmployeeDto object representing the Employee to create
     * @return {Promise<Employee>} the created employee
     * @throws
     * exception is thrown if employee creation fails.
     */
    public async createEmployee(employeeToCreate: EmployeeDto): Promise<Employee> {
        try {
            return await this.employeeDao.createEmployee(employeeToCreate)
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Call the EmployeeDao for updating Employee.
     *
     * @async
     * @param {UpdateEmployeeDto} employee EmployeeDto object representing the Employee with properties to update
     * @param {string} employeeSn serial number of the employee to update
     * @return {Promise<Employee>} the updated employee
     * @throws
     * exception is thrown if employee update fails.
     */
    public async updateEmployee(employee: UpdateEmployeeDto, employeeSn: string): Promise<Employee> {
        try {
            return await this.employeeDao.updateEmployee(employee, employeeSn);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Call the EmployeeDao for soft-delete Employee.
     *
     * @async
     * @param {string} employeeSn serial number of the employee to delete
     * @return {Promise<UpdateResult>} Result object returned by UpdateQueryBuilder execution.
     * @throws
     * exception is thrown if employee update fails or if employee has task assigned
     */
    public async deleteEmployee(employeeSn: string): Promise<UpdateResult> {
        try {
            let taskList:Task[] = await this.taskDao.findAllTasks(null, employeeSn);
            if (taskList && taskList.length > 0) {
                throw new HttpException(500, "Cannot delete an employee with associated active tasks.");
            }
            return await this.employeeDao.deleteEmployee(employeeSn);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Call the EmployeeDao for searching all the employees
     *
     * @async
     * @param {Pagination} pagination Pagination configuration
     * @return {Promise<Employee[]>} List of all the employees
     * @throws
     * exception is thrown if search fails.
     */
    public async getEmployeeList(pagination: Pagination): Promise<Employee[]> {
        try {
            return await this.employeeDao.findAllEmployees(pagination);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Call the EmployeeDao for searching a specific employee by serial number
     *
     * @async
     * @param {string} employeeSn The serial number of the emoloyee to search
     * @return {Promise<Employee> | undefined } the employee entity or undefined
     * @throws
     * exception is thrown if search fails.
     */
    public async getEmployeeById(employeeSn: string): Promise<Employee> {
        try {
            return await this.employeeDao.findOneEmployee(employeeSn);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Call the Task dao to retrieve the list of task assigned to an employee.
     *
     * @async
     * @param {Pagination} pagination
     * @param {string} employeeSn The employee serial number
     * @return {Promise<Task[]>} the list of tasks
     */
    public async retrieveEmployeeTasks(pagination: Pagination, employeeSn: string): Promise<Task[]> {
        try {
            return await this.taskDao.findAllTasks(pagination, employeeSn);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Check that dismissal date is not before the hiring date.
     * If one of hiring date or dismissal date is not provided,
     * get the missing date from the database,
     * querying employee with provided serial number.
     * @async
     * @param {string} employeeSn The employee serial number
     * @param {Date} hiringDate The employee hiring date
     * @param {Date} dismissalDate The employee dismissal date
     * @return {boolean} true if validate has passed, otherwise false.
     * @throws {HttpException} if employee is not found on database.
     */
    public async validateHiringDismissalDate(employeeSn: string, hiringDate: Date, dismissalDate: Date): Promise<boolean> {

        if (!hiringDate && !dismissalDate) {
            return true;
        }
        else if (hiringDate && dismissalDate) {
            return dismissalDate > hiringDate;
        }
        else {
            const employee:Employee = await this.employeeDao.findOneEmployee(employeeSn);

            if (!employee) {
                throw new HttpException(500, `Cannot perform validation. Employee with serial number ${employeeSn} not found`);
            }

            if (hiringDate) {
                return employee.dismissal_date > hiringDate;
            }

            return dismissalDate > employee.hiring_date ;
        }

        return true;
    }
}
