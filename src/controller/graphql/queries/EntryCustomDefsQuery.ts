import { GraphQLNonNull, GraphQLFieldConfig, GraphQLList } from 'graphql';
import { AppContext } from '@app/init';
import { Entry } from '@model/Entry';
import { CustomDef } from '@model/CustomDef';
import { CustomDefUnionType } from '../types/CustomDefUnionType';

export const EntryCustomDefsQuery: GraphQLFieldConfig<Entry, AppContext> = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(CustomDefUnionType))),
    resolve: async (entry: Entry, _, ctx: AppContext): Promise<CustomDef[]> => {
        return await ctx.session.customDefService.getByPartOfSpeech({
            langId: entry.langId,
            partOfSpeech: entry.partOfSpeech,
        });
    },
};
