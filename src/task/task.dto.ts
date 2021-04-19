import { ProgressEnum } from "./progress.enum";
/**
 * Interface of Data Transfer Object for Task
 * @interface
 */

export interface TaskDto {
    /**
     * title.
     */
    title: string;
    /**
     * description
     */
    description: string;
    /**
     * progress status. Can have only one of the following values:
     * - new
     * - in progress
     * - done
     */
    progress: ProgressEnum;
    /**
     * Employee serial number (if task must be assigned to an employee)
     */
    employee?: string;
}
