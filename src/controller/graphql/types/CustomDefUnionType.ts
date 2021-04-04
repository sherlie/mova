import { GraphQLUnionType } from 'graphql';
import { OptionCustomDefType } from './OptionCustomDefType';
import { TableCustomDefType } from './TableCustomDefType';
import { TextCustomDefType } from './TextCustomDefType';

export const CustomDefUnionType = new GraphQLUnionType({
    name: 'CustomDefinition',
    types: [TextCustomDefType, OptionCustomDefType, TableCustomDefType],
});
