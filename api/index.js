const debug = require('debug')('express-graphql-api-boilerplate:api/index');
import express from 'express';
import { apolloServer } from 'apollo-server';
// import { schema, resolvers } from './schema';
import Schema from './schema';
import Resolvers from './resolvers';
import connectors from './connectors';

const graphQLServer = express();
const GRAPHQL_PORT = 8080;


graphQLServer.use('/graphql', apolloServer(request => ({
  graphiql: true,   // TODO conf in dev and test only
  pretty: true,     // TODO conf in dev and test only
  connectors: connectors,
  schema: Schema,
  resolvers: Resolvers,
  context: request.session
})));

graphQLServer.listen(GRAPHQL_PORT, () => {
  debug(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`)
});
