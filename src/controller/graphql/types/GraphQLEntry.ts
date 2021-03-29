import { AppContext } from '@app/index';
import { Entry } from '@model/Entry';
import {
    GraphQLObjectType,
    GraphQLFieldConfigMap,
    GraphQLNonNull,
    GraphQLID,
    GraphQLString,
} from 'graphql';
import { GraphQLLang } from './GraphQLLang';

export const GraphQLEntry: GraphQLObjectType = new GraphQLObjectType<Entry>({
    name: 'Entry',
    fields: (): GraphQLFieldConfigMap<Entry, AppContext> => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        original: {
            type: GraphQLNonNull(GraphQLString),
        },
        translation: {
            type: GraphQLNonNull(GraphQLString),
        },
        lang: {
            type: GraphQLNonNull(GraphQLLang),
            resolve: async (entry, _, ctx) => {
                return ctx.session.langDataLoader.loadMany(entry.langId);
            },
        },
    }),
});
