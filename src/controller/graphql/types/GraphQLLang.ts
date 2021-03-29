import { Context } from 'koa';
import {
    GraphQLFieldConfigMap,
    GraphQLID,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';
import { Lang } from '@model/Lang';

export const GraphQLLang: GraphQLObjectType = new GraphQLObjectType<Lang>({
    name: 'Lang',
    fields: (): GraphQLFieldConfigMap<Lang, Context> => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
    }),
});
