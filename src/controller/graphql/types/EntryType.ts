import { AppContext } from '@app/init';
import { CustomValue } from '@model/CustomValue';
import { Entry } from '@model/Entry';
import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { EntryCustomDefsQuery } from '../queries/EntryCustomDefsQuery';
import { CustomValueUnionType } from './CustomValueUnionType';
import { getPageType } from './PageType';
import { PartOfSpeechEnumType } from './PartOfSpeechEnumType';

export const EntryType = new GraphQLObjectType<Entry, AppContext>({
    name: 'Entry',
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        original: {
            type: GraphQLNonNull(GraphQLString),
        },
        translation: {
            type: GraphQLNonNull(GraphQLString),
        },
        partOfSpeech: {
            type: GraphQLNonNull(PartOfSpeechEnumType),
        },
        customValues: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(CustomValueUnionType))),
            resolve: (entry: Entry): CustomValue[] =>
                entry.customValues ? Array.from(entry.customValues.values()) : [],
        },
        customDefinitions: EntryCustomDefsQuery,
    },
});

export const EntryPageType = getPageType('EntryPage', EntryType);
