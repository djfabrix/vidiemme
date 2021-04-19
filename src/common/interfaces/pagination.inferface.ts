/**
 * Pagination interface. Define offset and limit for paginated queries.
 * @class {object} Pagination
 */

export interface Pagination {

    /**
     * limit the number of rows returned
     */
    limit: number;

    /**
     *  number of rows omitted before the beginning
     */
    offset: number;
}
