// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const Home = ({ data }) => (
  <div>
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
