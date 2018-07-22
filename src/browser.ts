import { ApolloCache } from 'apollo-cache';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createHttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { IResolvers } from 'graphql-tools';
import React from 'react';
import ReactDOM from 'react-dom';
import BrowserRoot from './components/BrowserRoot';

/**
 * Extract the inlined Apollo state from HTML for rehydration.
 *
 * @returns Initial Apollo cache object.
 */
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

/**
 * @returns Local state resolvers for apollo-link-state.
 * @see https://www.apollographql.com/docs/link/links/state.html#resolver
 */
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

function getApolloLink(cache: ApolloCache<NormalizedCacheObject>): ApolloLink {
  // Link for local state (https://www.apollographql.com/docs/link/links/state.html)
  const stateLink = withClientState({
    cache,
    resolvers: getLinkStateResolvers(),
    defaults: {
      error: {
        message: '',
        __typename: 'Error',
      },
    },
  });

  // Custom link to reset the local state error on every request.
  const resetErrorLink = new ApolloLink((operation, forward) => {
    cache.writeData({
      data: {
        error: {
          message: '',
          __typename: 'Error',
        },
      },
    });
    return forward ? forward(operation) : null;
  });

  // Error handler (https://www.apollographql.com/docs/link/links/error.html)
  const errorLink = onError(({ networkError }) => {
    if (networkError) {
      // Set the local state error.
      cache.writeData({
        data: {
          error: {
            message: networkError.message,
            __typename: 'Error',
          },
        },
      });
    }
  });

  // Link to the backend (https://www.apollographql.com/docs/link/links/http.html)
  const httpLink = createHttpLink();

  return ApolloLink.from([stateLink, resetErrorLink, errorLink, httpLink]);
}

function getApolloClient() {
  const cache = new InMemoryCache().restore(getApolloState());
  const link = getApolloLink(cache);

  return new ApolloClient({
    link,
    cache,
  });
}

const apolloClient = getApolloClient();
const element = React.createElement(BrowserRoot, { apolloClient });

ReactDOM.hydrate(element, document.getElementById('main'));
