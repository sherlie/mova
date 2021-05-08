import { Context } from 'koa';
import { Schema } from 'joi';

export interface ValidationSchema {
    path?: Schema;
    query?: Schema;
    body?: Schema;
}

export function validate(ctx: Context, config: ValidationSchema): any {
    let input = {};
    if (config.path) {
        input = { ...validateSchema(ctx.params, config.path) };
    }

    if (config.query) {
        input = { ...validateSchema(ctx.request.query, config.query) };
    }

    if (config.body) {
        input = { ...validateSchema(ctx.request.body, config.body) };
    }

    return input;
}

function validateSchema(params: any, schema: Schema): any {
    const { error, value } = schema.validate(params, {
        stripUnknown: true,
    });

    if (error) {
        throw new Error(error.message);
    }

    return value;
}
