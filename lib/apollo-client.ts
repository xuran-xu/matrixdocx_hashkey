import { ApolloClient, InMemoryCache } from '@apollo/client';

export function getApolloClient() {
  return new ApolloClient({
    uri: 'https://your-graphql-endpoint.com',
    cache: new InMemoryCache(),
  });
} 