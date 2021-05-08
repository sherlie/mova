import Joi from 'joi';
import { validate, ValidationSchema } from '../validate';
import { Lang } from '@model/Lang';
import { Context } from 'koa';
import { AppContext } from '@app/init';
import { mapLang } from '../mappers';

const schema: ValidationSchema = {
    body: Joi.object({
        name: Joi.string().required(),
    }),
};

export interface CreateLangInput {
    name: string;
}

export async function createLang(ctx: Context & AppContext): Promise<Lang> {
    const input: CreateLangInput = validate(ctx, schema);

    const lang = await ctx.session.langService.create(input);
    return mapLang(lang);
}
