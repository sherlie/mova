import {
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLUnionType,
} from 'graphql';
import { Page } from '@repository/paging';

export function getPageType<T>(
    name: string,
    itemType: GraphQLObjectType | GraphQLUnionType,
): GraphQLObjectType<Page<T>> {
    return new GraphQLObjectType({
        name,
        fields: () => ({
            items: {
                type: GraphQLNonNull(GraphQLList(GraphQLNonNull(itemType))),
            },
            hasMore: {
                type: GraphQLNonNull(GraphQLBoolean),
            },
        }),
    });
}
