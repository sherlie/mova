import { AppContext } from '@app/init';
import { CustomId, OptionId, TableCellId } from '@model/CustomDef';
import { Entry, PartOfSpeech } from '@model/Entry';
import { LangId } from '@model/Lang';
import { UpsertCustomValue } from '@service/EntryService';
import {
    GraphQLFieldConfig,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql';
import { EntryType } from '../types/EntryType';
import { PartOfSpeechEnumType } from '../types/PartOfSpeechEnumType';
import { getResultResolver, getResultType } from '../types/ResultType';

interface CreateEntryMutationArgs {
    input: {
        original: string;
        translation: string;
        langId: LangId;
        partOfSpeech: PartOfSpeech;
        customValues?: {
            id: CustomId;
            text?: string;
            singleOption?: OptionId;
            multiOption?: OptionId[];
            table?: {
                id: TableCellId;
                value: string;
            }[];
        }[];
    };
}

const CreateEntryInputType = new GraphQLInputObjectType({
    name: 'CreateEntryInput',
    fields: () => ({
        original: {
            type: GraphQLNonNull(GraphQLString),
        },
        translation: {
            type: GraphQLNonNull(GraphQLString),
        },
        langId: {
            type: GraphQLNonNull(GraphQLID),
        },
        partOfSpeech: {
            type: GraphQLNonNull(PartOfSpeechEnumType),
        },
        customValues: {
            type: GraphQLList(CreateEntryCustomValueInputType),
        },
    }),
});

const CreateEntryCustomValueInputType = new GraphQLInputObjectType({
    name: 'CreateEntryCustomValueInput',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        text: {
            type: GraphQLString,
        },
        singleOption: {
            type: GraphQLID,
        },
        multiOption: {
            type: GraphQLList(GraphQLID),
        },
        table: {
            type: GraphQLList(CreateEntryCustomValueTableCellInputType),
        },
    }),
});

const CreateEntryCustomValueTableCellInputType = new GraphQLInputObjectType({
    name: 'CreateEntryCustomValueTableCellInput',
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        value: {
            type: GraphQLString,
        },
    },
});

export const CreateEntryMutation: GraphQLFieldConfig<
    unknown,
    AppContext,
    CreateEntryMutationArgs
> = {
    type: getResultType('EntryResult', EntryType),
    args: {
        input: {
            type: GraphQLNonNull(CreateEntryInputType),
        },
    },
    resolve: getResultResolver(
        async (_: unknown, args: CreateEntryMutationArgs, ctx: AppContext): Promise<Entry> => {
            const { input } = args;
            const customValues =
                input.customValues &&
                new Map<CustomId, UpsertCustomValue>(
                    input.customValues.map(({ id, ...customValue }) => [id, customValue]),
                );
            const createEntry = {
                ...input,
                customValues,
            };

            return await ctx.session.entryService.create(createEntry);
        },
    ),
};
