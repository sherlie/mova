import { ApolloClient, InMemoryCache } from '@apollo/client';

export const API = 'http://localhost:9000/api/graphql';

export const client = new ApolloClient({
  uri: API,
  cache: new InMemoryCache(),
});
