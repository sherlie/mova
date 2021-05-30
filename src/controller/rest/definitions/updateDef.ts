import Joi from 'joi';
import { validate, ValidationSchema } from '../validate';
import { Context } from 'koa';
import { AppContext } from '@app/init';
import { ApiCustomDef, mapCustomDef } from '../mappers';
import { CustomId, OptionId, TableCellId } from '@model/CustomDef';

const schema: ValidationSchema = {
    path: Joi.object({
        id: Joi.string().required(),
    }),
    body: Joi.object({
        name: Joi.string(),
        options: Joi.object().pattern(/.*/, Joi.string()),
        table: Joi.object().pattern(/.*/, Joi.string()),
    }),
};

export interface UpdateDefInput {
    id: CustomId;
    name?: string;
    options?: Record<OptionId, string>;
    table?: Record<TableCellId, string>;
}

export async function updateDef(ctx: Context & AppContext): Promise<ApiCustomDef> {
    const input: UpdateDefInput = validate(ctx, schema);

    const customDef = await ctx.session.customDefService.update(input);
    return mapCustomDef(customDef);
}
