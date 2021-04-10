import { AppContext } from '@app/init';
import { Lang } from '@model/Lang';
import { GraphQLFieldConfig, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { LangType } from '../types/LangType';
import { getResultResolver, getResultType } from '../types/ResultType';

interface CreateLangMutationArgs {
    input: {
        name: string;
    };
}

const CreateLangInput = new GraphQLInputObjectType({
    name: 'CreateLanguageInput',
    fields: {
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
    },
});

export const CreateLangMutation: GraphQLFieldConfig<unknown, AppContext, CreateLangMutationArgs> = {
    type: getResultType('LanguageResult', LangType),
    args: {
        input: {
            type: GraphQLNonNull(CreateLangInput),
        },
    },
    resolve: getResultResolver(
        async (_: unknown, args: CreateLangMutationArgs, ctx: AppContext): Promise<Lang> => {
            return await ctx.session.langService.create(args.input);
        },
    ),
};
