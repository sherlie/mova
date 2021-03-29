import { AppContext } from '@app/index';
import { Lang } from '@model/Lang';
import { Page } from '@repository/paging';
import { GraphQLNonNull, GraphQLInt, GraphQLFieldConfig } from 'graphql';
import { GraphQLLang } from '../types/GraphQLLang';
import { getGraphQLPageType } from '../types/GraphQLPage';

const DEFAULT_LIMIT = 10;

type LangsQueryArgs = {
    start: number;
    limit: number;
};

export const GraphQLLangsQuery: GraphQLFieldConfig<
    any,
    AppContext,
    LangsQueryArgs
> = {
    type: getGraphQLPageType('LangPage', GraphQLLang),
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
    resolve: async (
        _: any,
        args: LangsQueryArgs,
        ctx: AppContext,
    ): Promise<Page<Lang>> => {
        const { start, limit } = args;
        return await ctx.session.langService.getAll({ start, limit });
    },
};
