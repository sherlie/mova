import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { AppContext } from '@app/init';
import { isTextCustomValue, TextCustomValue } from '@model/CustomValue';
import { CustomValueInterfaceType } from './CustomValueInterfaceType';
import { CustomDefUnionType } from './CustomDefUnionType';

export const TextCustomValueType: GraphQLObjectType<
    TextCustomValue,
    AppContext
> = new GraphQLObjectType<TextCustomValue, AppContext>({
    name: 'TextCustomValue',
    interfaces: () => [CustomValueInterfaceType],
    fields: {
        definition: {
            type: GraphQLNonNull(CustomDefUnionType),
        },
        text: {
            type: GraphQLNonNull(GraphQLString),
        },
    },
    isTypeOf: isTextCustomValue,
});
