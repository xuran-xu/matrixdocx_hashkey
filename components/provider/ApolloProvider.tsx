'use client';

import { ApolloClient, InMemoryCache, ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';

// 创建 Apollo 客户端实例
const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/95045/hskhodlium/0.0.7',
  cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: { children: ReactNode }) {
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}