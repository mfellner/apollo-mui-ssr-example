import { MuiThemeProvider } from '@material-ui/core/styles';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import theme from '../theme';
import Application from './Application';

export type Props = {
  apolloClient: ApolloClient<NormalizedCacheObject>;
};

export default ({ apolloClient }: Props) => (
  <MuiThemeProvider theme={theme}>
    <ApolloProvider client={apolloClient}>
      <Application />
    </ApolloProvider>
  </MuiThemeProvider>
);
