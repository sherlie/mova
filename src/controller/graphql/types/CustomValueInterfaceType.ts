import { GraphQLNonNull, GraphQLInterfaceType } from 'graphql';
import { CustomDefUnionType } from './CustomDefUnionType';

export const CustomValueInterfaceType = new GraphQLInterfaceType({
    name: 'ICustomValue',
    fields: {
        definition: {
            type: GraphQLNonNull(CustomDefUnionType),
        },
    },
});
