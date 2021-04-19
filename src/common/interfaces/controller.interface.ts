import { Router } from "express";

/**
 * Interface definition for Controllers.
 *
 * @interface
 */
export interface IController {
    /**
     * path root REST path
     */
    path: string;

    /**
     * router Express router
     */
    router: Router;
}
