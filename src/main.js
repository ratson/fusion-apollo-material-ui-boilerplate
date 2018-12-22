// @flow
import 'isomorphic-fetch';

import Router from 'fusion-plugin-react-router';
import MuiThemeProvider, { MuiThemeProviderToken, MuiThemeToken } from 'fusion-plugin-material-ui';
import App, {ApolloClientToken} from 'fusion-apollo';
import ApolloClientPlugin, { ApolloClientEndpointToken } from 'fusion-apollo-universal-client';
import {GraphQLSchemaToken} from 'fusion-apollo';
import {FetchToken} from 'fusion-tokens';
import HelmetPlugin from 'fusion-plugin-react-helmet-async';
import ApolloServer, { ApolloServerEndpointToken } from 'fusion-plugin-apollo-server';
import {createMuiTheme} from '@material-ui/core/styles';
import unfetch from 'unfetch';
import {makeExecutableSchema} from 'graphql-tools';

import root from './root.js';

const typeDefs = `
type Greeting {
  message: String
}

type Query {
  greeting: Greeting
}
`

const resolvers = {
  Query: {
    greeting: () => ({
      message: 'Hello World!',
    }),
  }
}

export default () => {
  const app = new App(root);
  if (__BROWSER__) {
    app.register(FetchToken, window.fetch);
  }
  if (__NODE__) {
    app.register(FetchToken, unfetch);
  }
  app.register(HelmetPlugin);
  app.register(Router);

  // apollo
  __NODE__ && app.register(ApolloServer);
  __NODE__ && app.register(ApolloServerEndpointToken, '/graphql');
  app.register(ApolloClientEndpointToken, '/graphql');
  app.register(ApolloClientToken, ApolloClientPlugin);
  app.register(GraphQLSchemaToken, makeExecutableSchema({ typeDefs, resolvers }));

  // material-ui
  app.register(MuiThemeToken, createMuiTheme({
    typography: {
      useNextVariants: true,
    },
  }));
  app.register(MuiThemeProviderToken, MuiThemeProvider);

  return app;
};
