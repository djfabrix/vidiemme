import { Schema } from "joi";
import { RequestHandler } from "express";

/**
 *
 * Perform validation of the request body using Joi library.
 *
 * If validation is passed, the new validated body is attached to the request.
 *
 * Validated body is stripped of all unknown properties against the schema
 * @param {Schema} schema Joi validation schema
 * @see {@link https://joi.dev/|Joi}
 */
export function validationMiddleware(schema: Schema): RequestHandler {
    return (req, res, next) => {

        const { body } = req;

        const options = {
            allowUnknown: true, // ignore unknown props
            stripUnknown: true // remove unknown props
        };

        const { error, value } = schema.validate(body, options);

        if (!error) {
            req.body = value;
            next();
        }
        else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            res.json({error: message});
            //next(new HttpException(400, message));
        }
    }
}
