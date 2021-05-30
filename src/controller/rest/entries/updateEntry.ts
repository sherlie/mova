import Joi from 'joi';
import { validate, ValidationSchema } from '../validate';
import { Context } from 'koa';
import { AppContext } from '@app/init';
import { ApiEntryWithCustomValues, mapEntryWithCustomValues } from '../mappers';
import { CustomId, OptionId, TableCellId } from '@model/CustomDef';
import { EntryId } from '@model/Entry';

const schema: ValidationSchema = {
    path: Joi.object({
        id: Joi.string().required(),
    }),
    body: Joi.object({
        original: Joi.string(),
        translation: Joi.string(),
        customValues: Joi.object().pattern(
            /.*/,
            Joi.object({
                text: Joi.string(),
                option: Joi.string(),
                options: Joi.array().items(Joi.string()),
                table: Joi.object().pattern(/.*/, Joi.string()),
            }),
        ),
    }),
};

export interface UpdateEntryInput {
    id: EntryId;
    original: string;
    translation: string;
    customValues?: Record<CustomId, CreateCustomValueInput>;
}

export interface CreateCustomValueInput {
    text?: string;
    option?: OptionId;
    options?: OptionId[];
    table?: Record<TableCellId, string>;
}

export async function updateEntry(ctx: Context & AppContext): Promise<ApiEntryWithCustomValues> {
    const input: UpdateEntryInput = validate(ctx, schema);

    const entry = await ctx.session.entryService.update(input);
    return mapEntryWithCustomValues(entry);
}
