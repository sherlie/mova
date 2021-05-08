import Joi from 'joi';
import { AppContext } from '@app/init';
import { validate, ValidationSchema } from '../validate';
import { Context } from 'koa';
import { Maybe } from '@util/types';
import { EntryId } from '@model/Entry';
import { ApiEntryWithCustomValues, mapEntryWithCustomValues } from '../mappers';

const schema: ValidationSchema = {
    path: Joi.object({
        id: Joi.string().required(),
    }),
};

export interface GetEntryInput {
    id: EntryId;
}

export async function getEntry(
    ctx: Context & AppContext,
): Promise<Maybe<ApiEntryWithCustomValues>> {
    const input: GetEntryInput = validate(ctx, schema);

    const entry = await ctx.session.entryService.getById(input.id);
    return mapEntryWithCustomValues(entry);
}
