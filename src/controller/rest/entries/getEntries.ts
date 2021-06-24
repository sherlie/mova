import Joi from 'joi';
import { AppContext } from '@app/init';
import { validate, ValidationSchema } from '../validate';
import { mapPage, Page, PageScope } from '@repository/paging';
import { Context } from 'koa';
import { LangId } from '@model/Lang';
import { ApiEntry, mapEntry } from '../mappers';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const schema: ValidationSchema = {
    query: Joi.object({
        langId: Joi.string().required(),
        start: Joi.number().integer().positive().allow(0).default(0),
        limit: Joi.number().integer().positive().default(DEFAULT_LIMIT).max(MAX_LIMIT),
    }),
};

export interface GetEntriesInput extends PageScope {
    langId: LangId;
}

export async function getEntries(ctx: Context & AppContext): Promise<Page<ApiEntry>> {
    const input: GetEntriesInput = validate(ctx, schema);

    const entries = await ctx.session.entryService.getAll(input);
    return mapPage(entries, mapEntry);
}
