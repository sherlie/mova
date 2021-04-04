import { AppContext } from '@app/init';
import { Lang } from '@model/Lang';
import { Page } from '@repository/paging';
import { GraphQLNonNull, GraphQLInt, GraphQLFieldConfig } from 'graphql';
import { LangPageType } from '../types/LangType';

const DEFAULT_LIMIT = 10;

type LangsQueryArgs = {
    start: number;
    limit: number;
};

export const LangsQuery: GraphQLFieldConfig<any, AppContext, LangsQueryArgs> = {
    type: GraphQLNonNull(LangPageType),
    args: {
        start: {
            type: GraphQLNonNull(GraphQLInt),
            defaultValue: 0,
        },
        limit: {
            type: GraphQLNonNull(GraphQLInt),
            defaultValue: DEFAULT_LIMIT,
        },
    },
    resolve: async (_: any, args: LangsQueryArgs, ctx: AppContext): Promise<Page<Lang>> => {
        const { start, limit } = args;
        return await ctx.session.langService.getAll({ start, limit });
    },
};
