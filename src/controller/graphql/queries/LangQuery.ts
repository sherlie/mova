import { AppContext } from '@app/init';
import { Lang, LangId } from '@model/Lang';
import { Maybe } from '@util/types';
import { GraphQLNonNull, GraphQLFieldConfig, GraphQLID } from 'graphql';
import { LangType } from '../types/LangType';

type LangQueryArgs = {
    id: LangId;
};

export const LangQuery: GraphQLFieldConfig<unknown, AppContext, LangQueryArgs> = {
    type: LangType,
    args: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
    },
    resolve: async (_: unknown, args: LangQueryArgs, ctx: AppContext): Promise<Maybe<Lang>> => {
        return await ctx.session.langDataLoader.load(args.id);
    },
};
