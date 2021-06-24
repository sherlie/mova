import Joi from 'joi';
import { AppContext } from '@app/init';
import { validate, ValidationSchema } from '../validate';
import { LangId } from '@model/Lang';
import { Context } from 'koa';
import { ApiCustomDef, mapCustomDef } from '../mappers';
import { PartOfSpeech } from '@model/Entry';
import { mapPage, Page, PageScope } from '@repository/paging';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const schema: ValidationSchema = {
    query: Joi.object({
        langId: Joi.string().required(),
        partOfSpeech: Joi.valid(...Object.values(PartOfSpeech)).allow(null),
        start: Joi.number().integer().positive().allow(0).default(0),
        limit: Joi.number().integer().positive().default(DEFAULT_LIMIT).max(MAX_LIMIT),
    }),
};

export interface GetDefsInput extends PageScope {
    langId: LangId;
    partOfSpeech?: PartOfSpeech;
}

export async function getDefs(ctx: Context & AppContext): Promise<Page<ApiCustomDef>> {
    const input: GetDefsInput = validate(ctx, schema);

    const customDefs = await ctx.session.customDefService.getAll(input);
    return mapPage(customDefs, mapCustomDef);
}
