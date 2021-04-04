import { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInterfaceType } from 'graphql';
import { PartOfSpeechEnumType } from './PartOfSpeechEnumType';
import { CustomTypeEnumType } from './CustomTypeEnumType';

export const CustomDefInterfaceType = new GraphQLInterfaceType({
    name: 'ICustomDefinition',
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
});
