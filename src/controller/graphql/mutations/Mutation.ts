import { AppContext } from '@app/init';
import { GraphQLObjectType } from 'graphql';
import { CreateCustomDefMutation } from './CreateCustomDefMutation';
import { CreateEntryMutation } from './CreateEntryMutation';
import { CreateLangMutation } from './CreateLangMutation';

export const Mutation = new GraphQLObjectType<unknown, AppContext>({
    name: 'Mutation',
    fields: {
        createLanguage: CreateLangMutation,
        createCustomDefinition: CreateCustomDefMutation,
        createEntry: CreateEntryMutation,
    },
});
