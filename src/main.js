// @flow
import App from 'fusion-react';
import Router from 'fusion-plugin-react-router';
import MuiThemeProvider, {
  MuiThemeProviderToken,
  MuiThemeToken,
} from 'fusion-plugin-material-ui';
import {createMuiTheme} from '@material-ui/core/styles';

import root from './root.js';

export default () => {
  const app = new App(root);
  app.register(Router);
  app.register(MuiThemeToken, createMuiTheme({
    typography: {
      useNextVariants: true,
    },
  }));
  app.register(MuiThemeProviderToken, MuiThemeProvider);
  return app;
};
