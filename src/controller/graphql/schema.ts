import { GraphQLSchema } from 'graphql';
import { GraphQLQuery } from './queries/GraphQLQuery';

export const schema = new GraphQLSchema({
    query: GraphQLQuery,
});
