import { AppContext } from '@app/init';
import { EntryId, Entry } from '@model/Entry';
import { Lang } from '@model/Lang';
import { Maybe } from '@util/types';
import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from 'graphql';
import { EntryType } from '../types/EntryType';

interface EntryQueryArgs {
    id: EntryId;
}

export const EntryQuery: GraphQLFieldConfig<Lang, AppContext, EntryQueryArgs> = {
    type: GraphQLNonNull(EntryType),
    args: {
        id: {
            type: GraphQLNonNull(GraphQLID),
            defaultValue: 0,
        },
    },
    resolve: async (lang: Lang, args: EntryQueryArgs, ctx: AppContext): Promise<Maybe<Entry>> => {
        return await ctx.session.entryService.getById(args.id);
    },
};
