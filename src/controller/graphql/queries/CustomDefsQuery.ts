import { GraphQLNonNull, GraphQLFieldConfig, GraphQLList } from 'graphql';
import { AppContext } from '@app/init';
import { PartOfSpeech } from '@model/Entry';
import { Lang } from '@model/Lang';
import { PartOfSpeechEnumType } from '../types/PartOfSpeechEnumType';
import { CustomDef } from '@model/CustomDef';
import { CustomDefUnionType } from '../types/CustomDefUnionType';

type CustomDefsQueryArgs = {
    partOfSpeech: PartOfSpeech;
};

export const CustomDefsQuery: GraphQLFieldConfig<Lang, AppContext> = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(CustomDefUnionType))),
    args: {
        partOfSpeech: {
            type: GraphQLNonNull(PartOfSpeechEnumType),
        },
    },
    resolve: async (
        lang: Lang,
        args: CustomDefsQueryArgs,
        ctx: AppContext,
    ): Promise<CustomDef[]> => {
        return await ctx.session.customDefService.getAll({
            langId: lang.id,
            partOfSpeech: args.partOfSpeech,
        });
    },
};
