// src/lib/apollo-client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

export function getApolloClient() {
  return new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/95045/hskhodlium/0.0.7',
    cache: new InMemoryCache()
  });
}