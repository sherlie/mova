import Joi from 'joi';
import { AppContext } from '@app/init';
import { validate, ValidationSchema } from '../validate';
import { mapPage, Page, PageScope } from '@repository/paging';
import { Context } from 'koa';
import { ApiLang, mapLang } from '../mappers';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const schema: ValidationSchema = {
    query: Joi.object({
        start: Joi.number().integer().positive().allow(0).default(0),
        limit: Joi.number().integer().positive().default(DEFAULT_LIMIT).max(MAX_LIMIT),
    }),
};

export type GetLangsInput = PageScope;

export async function getLangs(ctx: Context & AppContext): Promise<Page<ApiLang>> {
    const input: GetLangsInput = validate(ctx, schema);

    const langs = await ctx.session.langService.getAll(input);
    return mapPage(langs, mapLang);
}
