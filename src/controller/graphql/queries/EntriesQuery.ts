import { GraphQLNonNull, GraphQLInt, GraphQLFieldConfig } from 'graphql';
import { AppContext } from '@app/init';
import { Entry } from '@model/Entry';
import { Page } from '@repository/paging';
import { EntryPageType } from '../types/EntryType';
import { Lang } from '@model/Lang';

const DEFAULT_LIMIT = 10;

type EntriesQueryArgs = {
    start: number;
    limit: number;
};

export const EntriesQuery: GraphQLFieldConfig<Lang, AppContext, EntriesQueryArgs> = {
    type: GraphQLNonNull(EntryPageType),
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
    resolve: async (lang: Lang, args: EntriesQueryArgs, ctx: AppContext): Promise<Page<Entry>> => {
        const { start, limit } = args;
        return await ctx.session.entryService.getAll({ langId: lang.id, start, limit });
    },
};
