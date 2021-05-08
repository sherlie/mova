import Joi from 'joi';
import { validate, ValidationSchema } from '../validate';
import { Context } from 'koa';
import { AppContext } from '@app/init';
import { ApiEntryWithCustomValues, mapEntryWithCustomValues } from '../mappers';
import { CustomId, OptionId, TableCellId } from '@model/CustomDef';
import { PartOfSpeech } from '@model/Entry';
import { LangId } from '@model/Lang';

const schema: ValidationSchema = {
    body: Joi.object({
        original: Joi.string().required(),
        translation: Joi.string().required(),
        langId: Joi.string().required(),
        partOfSpeech: Joi.valid(...Object.values(PartOfSpeech)).required(),
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

export interface CreateEntryInput {
    original: string;
    translation: string;
    langId: LangId;
    partOfSpeech: PartOfSpeech;
    customValues?: Record<CustomId, CreateCustomValueInput>;
}

export interface CreateCustomValueInput {
    text?: string;
    option?: OptionId;
    options?: OptionId[];
    table?: Record<TableCellId, string>;
}

export async function createEntry(ctx: Context & AppContext): Promise<ApiEntryWithCustomValues> {
    const input: CreateEntryInput = validate(ctx, schema);

    const entry = await ctx.session.entryService.create(input);
    return mapEntryWithCustomValues(entry);
}
