import { AppContext } from '@app/init';
import {
    isMultiOptionCustomDef,
    isSingleOptionCustomDef,
    OptionCustomDef,
    OptionId,
} from '@model/CustomDef';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID, GraphQLString } from 'graphql';
import { CustomDefInterfaceType } from './CustomDefInterfaceType';
import { CustomTypeEnumType } from './CustomTypeEnumType';
import { PartOfSpeechEnumType } from './PartOfSpeechEnumType';

export interface Option {
    id: OptionId;
    value: string;
}

export const OptionType = new GraphQLObjectType<Option, AppContext>({
    name: 'Option',
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        value: {
            type: GraphQLNonNull(GraphQLString),
        },
    },
});

export const OptionCustomDefType: GraphQLObjectType<
    OptionCustomDef,
    AppContext
> = new GraphQLObjectType<OptionCustomDef, AppContext>({
    name: 'OptionCustomDefinition',
    interfaces: () => [CustomDefInterfaceType],
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
        type: {
            type: GraphQLNonNull(CustomTypeEnumType),
        },
        partOfSpeech: {
            type: GraphQLNonNull(PartOfSpeechEnumType),
        },
        options: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OptionType))),
            resolve: (optCustomDef: OptionCustomDef): Option[] => {
                return Array.from(optCustomDef.options).map(([id, value]) => ({
                    id,
                    value,
                }));
            },
        },
    },
    isTypeOf: (optionCustomDef) =>
        isSingleOptionCustomDef(optionCustomDef) || isMultiOptionCustomDef(optionCustomDef),
});
