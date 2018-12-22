// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {Helmet} from 'fusion-plugin-react-helmet-async';

const Home = ({ data }) => (
  <div>
    <Helmet>
      <title>Hello World</title>
    </Helmet>
    <Button variant="contained" color="primary">
      {data.greeting ? data.greeting.message : 'Loading...'}
    </Button>
  </div>
);

export default graphql(gql`
  query GreetingQuery {
    greeting {
      message
    }
  }
`)(Home);
