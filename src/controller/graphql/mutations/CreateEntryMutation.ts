import { AppContext } from '@app/init';
import { CustomId, OptionId, TableCellId } from '@model/CustomDef';
import { Entry, PartOfSpeech } from '@model/Entry';
import { LangId } from '@model/Lang';
import { CreateCustomValue } from '@service/EntryService';
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
        customValues?: [
            {
                id: CustomId;
                text?: string;
                option?: OptionId;
                options?: OptionId[];
                cells?: {
                    id: TableCellId;
                    value: string;
                }[];
            },
        ];
    };
}

const CreateEntryInput = new GraphQLInputObjectType({
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
            type: GraphQLList(CreateEntryCustomValueInput),
        },
    }),
});

const CreateEntryCustomValueInput = new GraphQLInputObjectType({
    name: 'CreateEntryCustomValueInput',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        text: {
            type: GraphQLString,
        },
        option: {
            type: GraphQLID,
        },
        options: {
            type: GraphQLList(GraphQLID),
        },
        cells: {
            type: GraphQLList(CreateEntryCustomValueTableCellInput),
        },
    }),
});

const CreateEntryCustomValueTableCellInput = new GraphQLInputObjectType({
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

export const CreateEntryMutation: GraphQLFieldConfig<any, AppContext, CreateEntryMutationArgs> = {
    type: getResultType('EntryResult', EntryType),
    args: {
        input: {
            type: GraphQLNonNull(CreateEntryInput),
        },
    },
    resolve: getResultResolver(
        async (_: any, args: CreateEntryMutationArgs, ctx: AppContext): Promise<Entry> => {
            const { input } = args;
            const customValues =
                input.customValues &&
                new Map<CustomId, CreateCustomValue>(
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
