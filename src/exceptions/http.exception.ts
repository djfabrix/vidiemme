/**
 * Custom Exception
 * @class
 */
export class HttpException extends Error {

    /**
     * http status code
     */
    public status: number;

    /**
     * error message description
     */
    public message: string;

    /**
     * @constructor
     * @param {number} status - http status code
     * @param {string} message - error message description
     */
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
