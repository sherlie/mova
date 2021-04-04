import {
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLUnionType,
} from 'graphql';
import { Page } from '@repository/paging';

export function getPageType(
    name: string,
    itemType: GraphQLObjectType | GraphQLUnionType,
): GraphQLObjectType<Page<any>> {
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
