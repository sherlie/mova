import { GraphQLNonNull, GraphQLFieldConfig, GraphQLList, GraphQLInt } from 'graphql';
import { AppContext } from '@app/init';
import { PartOfSpeech } from '@model/Entry';
import { Lang } from '@model/Lang';
import { PartOfSpeechEnumType } from '../types/PartOfSpeechEnumType';
import { CustomDef } from '@model/CustomDef';
import { CustomDefUnionType } from '../types/CustomDefUnionType';
import { Page } from '@repository/paging';

const DEFAULT_LIMIT = 10;

type CustomDefsQueryArgs = {
    start: number;
    limit: number;
    partOfSpeech?: PartOfSpeech;
};

export const CustomDefsQuery: GraphQLFieldConfig<Lang, AppContext> = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(CustomDefUnionType))),
    args: {
        start: {
            type: GraphQLNonNull(GraphQLInt),
            defaultValue: 0,
        },
        limit: {
            type: GraphQLNonNull(GraphQLInt),
            defaultValue: DEFAULT_LIMIT,
        },
        partOfSpeech: {
            type: PartOfSpeechEnumType,
        },
    },
    resolve: async (
        lang: Lang,
        args: CustomDefsQueryArgs,
        ctx: AppContext,
    ): Promise<Page<CustomDef>> => {
        return await ctx.session.customDefService.getAll({
            start: args.start,
            limit: args.limit,
            langId: lang.id,
            partOfSpeech: args.partOfSpeech,
        });
    },
};
