import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Employee } from "../employee/employee.model";
import { ProgressEnum } from "./progress.enum";
import { Type } from "class-transformer";

/**
 * @class Task
 * Task entity for TypeORM
 */
@Entity()
export class Task {

    /**
     * Id. Primary autoincrement.
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * title
     */
    @Column()
    title: string;

    /**
     * description
     */
    @Column()
    description: string;

    /**
     * Progress status. Can have only one of the following values:
     * - new
     * - in progress
     * - done
     */
    @Column({ type: 'enum', enum: ProgressEnum })
    progress: ProgressEnum;

    /**
     * Date of creation
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * Date of updating
     */
    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Date of deleting
     */
    @DeleteDateColumn()
    deletedAt: Date;

    /**
     * Many to one relationship. A task is assigned to only one employee
     */
    @Type(() => Employee)
    @ManyToOne(() => Employee, employee => employee.tasks)
    @JoinColumn({name: "employee_sn"})
    employee: Employee;
}
