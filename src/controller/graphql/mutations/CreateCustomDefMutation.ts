import {
    GraphQLFieldConfig,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql';
import { AppContext } from '@app/init';
import { PartOfSpeech } from '@model/Entry';
import { LangId } from '@model/Lang';
import { PartOfSpeechEnumType } from '../types/PartOfSpeechEnumType';
import { getResultResolver, getResultType } from '../types/ResultType';
import { CustomTypeEnumType } from '../types/CustomTypeEnumType';
import { CustomDef, CustomType } from '@model/CustomDef';
import { CustomDefUnionType } from '../types/CustomDefUnionType';

interface CreateCustomDefMutationArgs {
    input: {
        name: string;
        type: CustomType;
        langId: LangId;
        partOfSpeech: PartOfSpeech;
        options?: string[];
        table?: string[];
    };
}

const CreateCustomDefInput = new GraphQLInputObjectType({
    name: 'CreateCustomDefinitionInput',
    fields: {
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
        type: {
            type: GraphQLNonNull(CustomTypeEnumType),
        },
        langId: {
            type: GraphQLNonNull(GraphQLID),
        },
        partOfSpeech: {
            type: GraphQLNonNull(PartOfSpeechEnumType),
        },
        options: {
            type: GraphQLList(GraphQLNonNull(GraphQLString)),
        },
        table: {
            type: GraphQLList(GraphQLNonNull(GraphQLString)),
        },
    },
});

export const CreateCustomDefMutation: GraphQLFieldConfig<
    any,
    AppContext,
    CreateCustomDefMutationArgs
> = {
    type: getResultType('CustomDefinitionResult', CustomDefUnionType),
    args: {
        input: {
            type: GraphQLNonNull(CreateCustomDefInput),
        },
    },
    resolve: getResultResolver(
        async (_: any, args: CreateCustomDefMutationArgs, ctx: AppContext): Promise<CustomDef> => {
            return await ctx.session.customDefService.create(args.input);
        },
    ),
};
