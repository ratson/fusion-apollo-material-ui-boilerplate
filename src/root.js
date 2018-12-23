// @flow
import React from 'react';
import {Route, Switch} from 'fusion-plugin-react-router';

import Home from './pages/home.js';
import Counter from './pages/counter.js';
import PageNotFound from './pages/pageNotFound.js';

const root = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/counter" component={Counter} />
    <Route component={PageNotFound} />
  </Switch>
);

export default root;
