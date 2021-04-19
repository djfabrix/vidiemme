import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import { Task } from "../task/task.model";

/**
 * @class Employee
 * Employee entity for TypeORM
 */
@Entity()
export class Employee {

    /**
     * Serial number. Primary autoincrement.
     */
    @PrimaryColumn()
    serial_number: string;

    /**
     * first name
     */
    @Column()
    name: string;

    /**
     * last name
     */
    @Column()
    surname: string;

    /**
     * email
     */
    @Column()
    email: string;

    /**
     * role
     */
    @Column()
    role: string;

    /**
     * Hiring date. Default value set to current timestamp.
     */
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    hiring_date: Date;

    /**
     * Dismissal date. Deafult value set to current timestamp.
     */
    @Column({ type: 'timestamp', nullable: true })
    dismissal_date: Date;

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
     * One to Many relationship. One employee can have more tasks assigned
     */
    @OneToMany(() => Task, task => task.employee)
    tasks: Task[];
}

