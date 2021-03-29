import {
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
} from 'graphql';
import { Page } from '@repository/paging';

export function getGraphQLPageType<T>(
    name: string,
    objectType: GraphQLObjectType<T>,
): GraphQLObjectType<Page<T>> {
    return new GraphQLObjectType({
        name,
        fields: () => ({
            items: {
                type: GraphQLNonNull(GraphQLList(objectType)),
            },
            hasMore: {
                type: GraphQLNonNull(GraphQLBoolean),
            },
        }),
    });
}
