import Joi from 'joi';
import { validate, ValidationSchema } from '../validate';
import { Context } from 'koa';
import { AppContext } from '@app/init';
import { ApiCustomDef, mapCustomDef } from '../mappers';
import { CustomType } from '@model/CustomDef';
import { PartOfSpeech } from '@model/Entry';
import { LangId } from '@model/Lang';

const schema: ValidationSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        type: Joi.valid(...Object.values(CustomType)).required(),
        langId: Joi.string().required(),
        partOfSpeech: Joi.valid(...Object.values(PartOfSpeech)).required(),
        options: Joi.array().items(Joi.string()),
        table: Joi.array().items(Joi.string()),
    }),
};

export interface CreateDefInput {
    name: string;
    type: CustomType;
    langId: LangId;
    partOfSpeech: PartOfSpeech;
    options?: string[];
    table?: string[];
}

export async function createDef(ctx: Context & AppContext): Promise<ApiCustomDef> {
    const input: CreateDefInput = validate(ctx, schema);

    const customDef = await ctx.session.customDefService.create(input);
    return mapCustomDef(customDef);
}
