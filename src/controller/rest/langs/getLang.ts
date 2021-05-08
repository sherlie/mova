import Joi from 'joi';
import { AppContext } from '@app/init';
import { validate, ValidationSchema } from '../validate';
import { LangId } from '@model/Lang';
import { Context } from 'koa';
import { Maybe } from '@util/types';
import { ApiLang, mapLang } from '../mappers';

const schema: ValidationSchema = {
    path: Joi.object({
        id: Joi.string().required(),
    }),
};

export interface GetLangInput {
    id: LangId;
}

export async function getLang(ctx: Context & AppContext): Promise<Maybe<ApiLang>> {
    const input: GetLangInput = validate(ctx, schema);

    const lang = await ctx.session.langService.getById(input.id);
    return lang ? mapLang(lang) : undefined;
}
