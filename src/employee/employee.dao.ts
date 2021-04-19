import { Logger } from "winston";
import { LoggerManager } from "../common/logger";

import { getConnection, getRepository, SelectQueryBuilder, UpdateResult } from "typeorm";
import { Employee } from "./employee.model";
import { EmployeeDto, UpdateEmployeeDto } from "./employee.dto";
import { Pagination } from "../common/interfaces/pagination.inferface";

/**
 * Singleton class EmployeeDao.
 * This class is responsible of the database access for the employee domain data
 * @class EmployeeDao
 */
export class EmployeeDao {

    /**
     * The singleton instance
     * @static
     * @private
     */
    private static instance: EmployeeDao;

    /**
     * Winston logger instance
     * @private
     */
    private logger: Logger;

    /**
     * Instantiate the Winston Logger
     * @constructor
     * @private
     */
    private constructor() {
        this.logger = LoggerManager.getLogger();
        //this.database = Database.instance;
    }

    /**
     * Return the existing class instance or instantiate a new one if not exists.
     * @static
     */
    public static getInstance(): EmployeeDao {
        if (!EmployeeDao.instance) {
            EmployeeDao.instance = new EmployeeDao();
        }

        return EmployeeDao.instance;
    }

    /**
     * Query the database for the employee with serial number provided.
     * @async
     * @param {string} employeeSn The employee serial number
     * @return {Promise<Employee> | undefined} The employee object. undefined if not found.
     * @throws exception is thrown if fails.
     */
    public async findOneEmployee(employeeSn: string): Promise<Employee> {
        try {
            return await this.createSelectQueryBuilder()
                .where("employee.serial_number = :employeeSn", { employeeSn: employeeSn })
                .getOne();
        }
        catch (e) {
            throw e;
        }

    }

    /**
     * Query the database for the list of all employees, with pagination options
     * @async
     * @param {Pagination} pagination pagination options
     * @return {Promise<Employee[]>} The list of employees
     * @throws exception is thrown if fails.
     */
    public async findAllEmployees(pagination: Pagination): Promise<Employee[]> {
        try {
            let qb = this.createSelectQueryBuilder();

            if (pagination && pagination.limit) {
                qb.take(pagination.limit);
            }

            if (pagination && pagination.offset) {
                qb.skip(pagination.offset)
            }

            return await qb.getMany();
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Query the database for employee creation
     * @async
     * @param {EmployeeDto} employeeToCreate object representing the Employee to create
     * @return {Promise<Employee>} The created employee
     * @throws exception is thrown if fails.
     */
    public async createEmployee(employeeToCreate: EmployeeDto): Promise<Employee> {
        try {
            const employeeRepository = getRepository(Employee);
            const employee = new Employee();

            return await employeeRepository.save({
                ...employee,
                ...employeeToCreate,
            });
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Query the database for employee update
     * @async
     * @param {UpdateEmployeeDto} employeeToUpdate object representing the Employee with properties to update
     * @param {string} employeeSn the serial number of the employee to update
     * @return {Promise<Employee | undefined>} The updated employee or undefined
     * @throws exception is thrown if fails.
     */
    public async updateEmployee(employeeToUpdate: UpdateEmployeeDto, employeeSn: string): Promise<Employee> {

        await getConnection()
            .createQueryBuilder()
            .update(Employee)
            .set(employeeToUpdate)
            .where("serial_number = :employeeSn", {employeeSn: employeeSn })
            .andWhere("deletedAt IS NULL")
            .execute();

        return await this.findOneEmployee(employeeSn);
    }

    /**
     * Query the database for employee soft-delete
     * @async
     * @param {string} employeeSn the serial number of the employee to update
     * @return {Promise<UpdateResult>} Result object returned by UpdateQueryBuilder execution.
     * @throws exception is thrown if fails.
     */
    public async deleteEmployee(employeeSn: string): Promise<UpdateResult> {
        return await getConnection()
            .createQueryBuilder()
            .softDelete()
            .from(Employee)
            .where("serial_number = :employeeSn", { employeeSn: employeeSn })
            .execute();
    }

    /**
     * Create TypeORM query builder object for Employee entity
     * @return {SelectQueryBuilder<Employee>} query builder object
     * @private
     */
    private createSelectQueryBuilder(): SelectQueryBuilder<Employee> {
        return getConnection()
            .getRepository(Employee)
            .createQueryBuilder("employee");
    }
}
