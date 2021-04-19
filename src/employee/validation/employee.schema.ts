const Joi = require('joi')
    .extend(require('@joi/date'));

/**
 * Joi validation schema validating dto on creation
 */
export const employeeSchema = Joi.object().keys({
    serial_number: Joi.string().length(5).pattern(/^[0-9]+$/).required(),
    name: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    hiring_date: Joi.date().format(['DD-MM-YYYY', 'YYYY-MM-DD']).required(),
    dismissal_date: Joi.date().format(['DD-MM-YYYY', 'YYYY-MM-DD']).greater(Joi.ref('hiring_date')).optional()
});

export const updateEmployeeSchema = Joi.object().keys({
    name: Joi.string().optional(),
    surname: Joi.string().optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().optional(),
    hiring_date: Joi.date().format(['DD-MM-YYYY', 'YYYY-MM-DD']).optional(),
    dismissal_date: Joi.date().format(['DD-MM-YYYY', 'YYYY-MM-DD']).optional()
});
