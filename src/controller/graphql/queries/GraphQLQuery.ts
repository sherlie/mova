import { AppContext } from '@app/index';
import { GraphQLObjectType } from 'graphql';
import { GraphQLLangsQuery } from './GraphQLLangsQuery';

export const GraphQLQuery = new GraphQLObjectType<any, AppContext>({
    name: 'Query',
    fields: () => ({
        langs: GraphQLLangsQuery,
    }),
});
