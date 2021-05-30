import Joi from 'joi';
import { validate, ValidationSchema } from '../validate';
import { Context } from 'koa';
import { AppContext } from '@app/init';
import { ApiEntryWithCustomValues, mapEntryWithCustomValues } from '../mappers';
import { EntryId } from '@model/Entry';

const schema: ValidationSchema = {
    path: Joi.object({
        id: Joi.string().required(),
    }),
};

export interface DeleteEntryInput {
    id: EntryId;
}

export async function deleteEntry(ctx: Context & AppContext): Promise<ApiEntryWithCustomValues> {
    const input: DeleteEntryInput = validate(ctx, schema);

    const entry = await ctx.session.entryService.delete(input.id);
    return mapEntryWithCustomValues(entry);
}
