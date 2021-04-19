/**
 * Interface of Data Transfer Object for Employee creation
 * @interface
 */
export interface EmployeeDto {
    /**
     * The serial number. It must have 5 digit string
     */
    serial_number: string;
    /**
     * First name
     */
    name: string;
    /**
     * Last name
     */
    surname: string;
    /**
     * Email
     */
    email: string;
    /**
     * Role
     */
    role: string;
    /**
     * Hiring date in DD/MM/YYYY format
     */
    hiring_date: Date;

    /**
     * Dismissal date in DD/MM/YYYY format
     */
    dismissal_date: Date;
}

/**
 * Interface of Data Transfer Object for Employee update
 * @interface
 */
export interface UpdateEmployeeDto {
    /**
     * First name
     */
    name: string;
    /**
     * Last name
     */
    surname: string;
    /**
     * Email
     */
    email: string;
    /**
     * Role
     */
    role: string;
    /**
     * Hiring date in DD/MM/YYYY format
     */
    hiring_date: Date;
    /**
     * Dismissal date in DD/MM/YYYY format
     */
    dismissal_date: Date;
}
