// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {Helmet} from 'fusion-plugin-react-helmet-async';
import {Translate} from 'fusion-plugin-i18n-react';
import {Link} from 'fusion-plugin-react-router';

const Home = ({ data }) => (
  <div>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <h1><Translate id="HomeTitle" /></h1>
    <Button variant="contained" color="primary">
      {data.greeting ? data.greeting.message : 'Loading...'}
    </Button>
    <p>
      <Link to="/counter">Counter</Link>
    </p>
  </div>
);

export default graphql(gql`
  query GreetingQuery {
    greeting {
      message
    }
  }
`)(Home);
