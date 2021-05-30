import Joi from 'joi';
import { validate, ValidationSchema } from '../validate';
import { Context } from 'koa';
import { AppContext } from '@app/init';
import { ApiCustomDef, mapCustomDef } from '../mappers';
import { CustomId } from '@model/CustomDef';

const schema: ValidationSchema = {
    path: Joi.object({
        id: Joi.string().required(),
    }),
};

export interface DeleteDefInput {
    id: CustomId;
}

export async function deleteDef(ctx: Context & AppContext): Promise<ApiCustomDef> {
    const input: DeleteDefInput = validate(ctx, schema);

    const customDef = await ctx.session.customDefService.delete(input.id);
    return mapCustomDef(customDef);
}
