import Joi from 'joi';
import { AppContext } from '@app/init';
import { validate, ValidationSchema } from '../validate';
import { Context } from 'koa';
import { ApiCustomDef, mapCustomDef } from '../mappers';
import { EntryId } from '@model/Entry';

const schema: ValidationSchema = {
    path: Joi.object({
        id: Joi.string().required(),
    }),
};

export interface getEntryDefsInput {
    id: EntryId;
}

export async function getEntryDefs(ctx: Context & AppContext): Promise<ApiCustomDef[]> {
    const input: getEntryDefsInput = validate(ctx, schema);

    const entry = await ctx.session.entryService.getById(input.id);
    const customDefs = await ctx.session.customDefService.getByPartOfSpeech({
        langId: entry.langId,
        partOfSpeech: entry.partOfSpeech,
    });
    return customDefs.map(mapCustomDef);
}
