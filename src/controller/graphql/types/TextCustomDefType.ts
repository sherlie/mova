import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { AppContext } from '@app/init';
import { TextCustomDef, isTextCustomDef } from '@model/CustomDef';
import { CustomDefInterfaceType } from './CustomDefInterfaceType';
import { PartOfSpeechEnumType } from './PartOfSpeechEnumType';
import { CustomTypeEnumType } from './CustomTypeEnumType';

export const TextCustomDefType: GraphQLObjectType<
    TextCustomDef,
    AppContext
> = new GraphQLObjectType<TextCustomDef, AppContext>({
    name: 'TextCustomDefinition',
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
    },
    isTypeOf: isTextCustomDef,
});
