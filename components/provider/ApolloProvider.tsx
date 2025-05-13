'use client';

import { ApolloProvider as Provider } from '@apollo/client';
import { getApolloClient } from '../../lib/apollo-client';
import React from 'react';

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  const client = getApolloClient();
  
  return <Provider client={client}>{children}</Provider>;
}