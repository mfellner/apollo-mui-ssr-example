import { createGenerateClassName } from '@material-ui/core/styles';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { ApolloServer } from 'apollo-server-micro';
import micro, { RequestHandler } from 'micro';
import { get, post, router } from 'microrouter';
import React from 'react';
import { getDataFromTree } from 'react-apollo';
import ReactDOM from 'react-dom/server';
import { SheetsRegistry } from 'react-jss/lib/jss';
import serveHandler from 'serve-handler';
import ServerRoot from './components/ServerRoot';
import View from './components/View';
import { getSchema } from './graphql/schema';

const pkg = require('../package.json');

const schema = getSchema();
const schemaLink = new SchemaLink({ schema });

const apolloServer = new ApolloServer({ schema });
const apolloHandler = apolloServer.createHandler();

const viewHandler: RequestHandler = async (req, res) => {
  const sheetsRegistry = new SheetsRegistry();
  const generateClassName = createGenerateClassName();

  let disableStylesGeneration = true;
  const getDisableStylesGeneration = () => disableStylesGeneration;

  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: schemaLink,
    cache: new InMemoryCache(),
  });

  const element = React.createElement(ServerRoot, {
    sheetsRegistry,
    generateClassName,
    apolloClient,
    getDisableStylesGeneration,
  });

  await getDataFromTree(element);

  const apolloState = apolloClient.extract();
  disableStylesGeneration = false;
  const body = ReactDOM.renderToString(element);
  const css = sheetsRegistry.toString();

  const view = React.createElement(View, {
    title: pkg.name,
    author: pkg.author.name,
    description: pkg.description,
    apolloState,
    css,
    body,
  });

  res.write('<!DOCTYPE html>');
  ReactDOM.renderToNodeStream(view).pipe(res);
};

const staticHandler: RequestHandler = (req, res) => {
  req.url = req.url!.replace(/\/static\//, '/');
  return serveHandler(req, res, {
    public: 'static',
    directoryListing: false,
  });
};

export const handler = router(
  post('/graphql', apolloHandler),
  get('/graphql', apolloHandler),
  get('/static/*', staticHandler),
  get('*', viewHandler),
);

if (require.main === module) {
  const port = 3000;
  micro(handler).listen(port);
  console.log(`listening at http://localhost:${port}`);
}
