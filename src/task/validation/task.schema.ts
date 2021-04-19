import Joi from "joi";
import { ProgressEnum } from "../progress.enum";

export const createTaskSchema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    progress: Joi.string().valid(...Object.values(ProgressEnum)).required(),
    employee: Joi.string().pattern(/^[0-9]+$/).length(5).optional()
});

export const updateTaskSchema = Joi.object().keys({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    progress: Joi.string().valid(...Object.values(ProgressEnum)).optional(),
    employee: Joi.string().pattern(/^[0-9]+$/).length(5).allow(null).optional()
});
