import { GraphQLEnumType } from 'graphql';
import { CustomType } from '@model/CustomDef';

export const CustomTypeEnumType = new GraphQLEnumType({
    name: 'CustomType',
    values: Object.fromEntries(
        Object.entries(CustomType).map(([key, str]) => [key, { value: str }]),
    ),
});
