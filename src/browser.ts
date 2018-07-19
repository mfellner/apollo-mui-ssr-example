import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
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

const apolloClient = new ApolloClient({
  link: createHttpLink(),
  cache: new InMemoryCache().restore(getApolloState()),
});

const element = React.createElement(BrowserRoot, { apolloClient });

ReactDOM.hydrate(element, document.getElementById('main'));
