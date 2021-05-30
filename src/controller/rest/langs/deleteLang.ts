import Joi from 'joi';
import { validate, ValidationSchema } from '../validate';
import { Context } from 'koa';
import { AppContext } from '@app/init';
import { Lang, LangId } from '@model/Lang';
import { mapLang } from '../mappers';

const schema: ValidationSchema = {
    path: Joi.object({
        id: Joi.string().required(),
    }),
};

export interface DeleteLangInput {
    id: LangId;
}

export async function deleteLang(ctx: Context & AppContext): Promise<Lang> {
    const input: DeleteLangInput = validate(ctx, schema);

    const lang = await ctx.session.langService.delete(input.id);
    return mapLang(lang);
}
