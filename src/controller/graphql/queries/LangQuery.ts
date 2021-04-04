import { AppContext } from '@app/init';
import { Lang, LangId } from '@model/Lang';
import { Maybe } from '@util/types';
import { GraphQLNonNull, GraphQLFieldConfig, GraphQLID } from 'graphql';
import { LangType } from '../types/LangType';

type LangQueryArgs = {
    id: LangId;
};

export const LangQuery: GraphQLFieldConfig<any, AppContext, LangQueryArgs> = {
    type: LangType,
    args: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
    },
    resolve: async (_: any, args: LangQueryArgs, ctx: AppContext): Promise<Maybe<Lang>> => {
        return await ctx.session.langService.getById(args.id);
    },
};
