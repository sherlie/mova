import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Lang } from '@model/Lang';
import { AppContext } from '@app/init';
import { EntriesQuery } from '../queries/EntriesQuery';
import { CustomDefsQuery } from '../queries/CustomDefsQuery';
import { EntryQuery } from '../queries/EntryQuery';
import { getPageType } from './PageType';

export const LangType = new GraphQLObjectType<Lang, AppContext>({
    name: 'Language',
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
        entries: EntriesQuery,
        entry: EntryQuery,
        definitions: CustomDefsQuery,
    },
});

export const LangPageType = getPageType('LanguagePage', LangType);
