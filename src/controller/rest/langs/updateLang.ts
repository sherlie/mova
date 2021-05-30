import Joi from 'joi';
import { validate, ValidationSchema } from '../validate';
import { Lang, LangId } from '@model/Lang';
import { Context } from 'koa';
import { AppContext } from '@app/init';
import { mapLang } from '../mappers';

const schema: ValidationSchema = {
    path: Joi.object({
        id: Joi.string().required(),
    }),
    body: Joi.object({
        name: Joi.string().required(),
    }),
};

export interface UpdateLangInput {
    id: LangId;
    name: string;
}

export async function updateLang(ctx: Context & AppContext): Promise<Lang> {
    const input: UpdateLangInput = validate(ctx, schema);

    const lang = await ctx.session.langService.update(input);
    return mapLang(lang);
}
