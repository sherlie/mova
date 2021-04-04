import { GraphQLSchema } from 'graphql';
import { Mutation } from './mutations/Mutation';
import { Query } from './queries/Query';
//import { OptionCustomDefType } from './types/OptionCustomDefType';
//import { TableCustomDefType } from './types/TableCustomDefType';
//import { TextCustomDefType } from './types/TextCustomDefType';

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
    //types: [TextCustomDefType, OptionCustomDefType, TableCustomDefType],
});
