import { GraphQLUnionType } from 'graphql';
import { MultiOptionCustomValueType } from './MultiOptionCustomValueType';
import { SingleOptionCustomValueType } from './SingleOptionCustomValueType';
import { TableCustomValueType } from './TableCustomValueType';
import { TextCustomValueType } from './TextCustomValueType';

export const CustomValueUnionType = new GraphQLUnionType({
    name: 'CustomValue',
    types: [
        TextCustomValueType,
        SingleOptionCustomValueType,
        MultiOptionCustomValueType,
        TableCustomValueType,
    ],
});
