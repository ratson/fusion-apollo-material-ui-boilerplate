// @flow
import 'isomorphic-fetch';
import winston from 'winston';

import {createPlugin} from 'fusion-core';
import Router from 'fusion-plugin-react-router';
import MuiThemeProvider, { MuiThemeProviderToken, MuiThemeToken } from 'fusion-plugin-material-ui';
import App, {ApolloClientToken} from 'fusion-apollo';
import ApolloClientPlugin, { ApolloClientEndpointToken } from 'fusion-apollo-universal-client';
import {GraphQLSchemaToken} from 'fusion-apollo';
import {FetchToken, LoggerToken} from 'fusion-tokens';
import HelmetPlugin from 'fusion-plugin-react-helmet-async';
import ApolloServer, { ApolloServerEndpointToken } from 'fusion-plugin-apollo-server';
import I18n, {I18nToken, I18nLoaderToken, createI18nLoader} from 'fusion-plugin-i18n-react';
import UniversalLogger, { UniversalLoggerConfigToken } from 'fusion-plugin-universal-logger';
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';
import ErrorHandling, {ErrorHandlerToken} from 'fusion-plugin-error-handling';
import {createMuiTheme} from '@material-ui/core/styles';
import unfetch from 'unfetch';
import {makeExecutableSchema} from 'graphql-tools';

import root from './root.js';

const typeDefs = `
type Greeting {
  message: String
}

type Counter {
  count: Int
}

type Query {
  greeting: Greeting
  counter: Counter
}

type Mutation {
  increment(step: Int): Counter
}
`
let count = 0
const resolvers = {
  Query: {
    greeting: () => ({
      message: 'Hello World!',
    }),
    counter: () => ({ count }),
  },
  Mutation: {
    increment(root, args) {
      count += args.step
      return { count }
    }
  },
}

export default () => {
  const app = new App(root);
  __BROWSER__ && app.register(FetchToken, window.fetch);
  __NODE__ && app.register(FetchToken, unfetch);
  app.register(HelmetPlugin);
  app.register(Router);
  app.register(UniversalEventsToken, UniversalEvents);

  // i18n
  app.register(I18nToken, I18n);
  __NODE__ && app.register(I18nLoaderToken, createI18nLoader());

  // logger
  app.register(LoggerToken, UniversalLogger);
  __NODE__ && app.register(UniversalLoggerConfigToken, {
    transports: [new winston.transports.Console()],
  });
  if (__NODE__) {
    const log = createPlugin({
      provides() {
        return (e, captureType) => {
            if (captureType === 'browser') {
              const {message, source, line, col, error} = e;
              console.log({message, source, line, col, error});
            } else if (captureType === 'server') {
              console.log('UNCAUGHT EXCEPTION', e);
            } else if (captureType === 'request') {
              console.log('REQUEST ERROR');
            }
          }
        }
      });
    // $FlowFixMe: col is missing in Error
    app.register(ErrorHandlerToken, log);
    app.register(ErrorHandling);
  }

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
