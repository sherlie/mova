import { AppContext } from '@app/init';
import { GraphQLObjectType } from 'graphql';
import { LangsQuery } from './LangsQuery';
import { LangQuery } from './LangQuery';

export const Query = new GraphQLObjectType<unknown, AppContext>({
    name: 'Query',
    fields: () => ({
        languages: LangsQuery,
        language: LangQuery,
    }),
});
