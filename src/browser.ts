import { ApolloCache } from 'apollo-cache';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { IResolvers } from 'graphql-tools';
import React from 'react';
import ReactDOM from 'react-dom';
import BrowserRoot from './components/BrowserRoot';

function getApolloState(): NormalizedCacheObject {
  const elements = document.getElementsByTagName('meta');
  for (let i = 0; i < elements.length; i += 1) {
    if (elements[i].name === 'apollo-state') {
      return JSON.parse(elements[i].content);
    }
  }
  return {};
}

type GetCacheKeyFn = (
  args: { __typename: string; id: string | number },
) => string | null | undefined;

type Context = { cache: ApolloCache<NormalizedCacheObject>; getCacheKey: GetCacheKeyFn };

function getLinkStateResolvers(): IResolvers<any, Context> {
  return {
    Mutation: {
      setError: (source, { message }, { cache }, info) => {
        cache.writeData<NormalizedCacheObject>({
          data: {
            error: {
              __typename: 'Error',
              message,
            },
          },
        });
        return null;
      },
    },
  };
}

function getApolloClient() {
  const cache = new InMemoryCache().restore(getApolloState());

  const stateLink = withClientState({
    cache,
    resolvers: getLinkStateResolvers(),
    defaults: {
      error: {
        __typename: 'Error',
        message: '',
      },
    },
  });
  const httpLink = createHttpLink();
  const link = ApolloLink.from([stateLink, httpLink]);

  return new ApolloClient({
    link,
    cache,
  });
}

const apolloClient = getApolloClient();
const element = React.createElement(BrowserRoot, { apolloClient });

ReactDOM.hydrate(element, document.getElementById('main'));
