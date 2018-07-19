import { MuiThemeProvider } from '@material-ui/core/styles';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { GenerateClassName } from 'jss';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import theme from '../theme';
import Application from './Application';

export type Props = {
  sheetsRegistry: SheetsRegistry;
  generateClassName: GenerateClassName<any>;
  apolloClient: ApolloClient<NormalizedCacheObject>;
  getDisableStylesGeneration: () => boolean;
};

export default ({
  sheetsRegistry,
  generateClassName,
  apolloClient,
  getDisableStylesGeneration,
}: Props) => (
  <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
    <MuiThemeProvider
      theme={theme}
      sheetsManager={new Map()}
      disableStylesGeneration={getDisableStylesGeneration()}
    >
      <ApolloProvider client={apolloClient}>
        <Application />
      </ApolloProvider>
    </MuiThemeProvider>
  </JssProvider>
);
