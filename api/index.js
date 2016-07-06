const debug = require('debug')('express-graphql-api-boilerplate:api/index');
import { apolloServer } from 'apollo-server';
import config from 'config';
import express from 'express';

import { FortuneCookie as FortuneCookieModel } from './http/models';
import { HttpConnector } from './connectors';
import { schema, resolvers } from './schema';

import db from '../models';

const graphQLServer = express();
const GRAPHQL_PORT = config.get('api.port');


graphQLServer.use('/graphql',
  apolloServer(request => {
    const httpConnector = new HttpConnector();

    return {
      graphiql: config.get('api.graphiql'),
      pretty: config.get('api.pretty'),
      schema,
      resolvers,
      context: {
        // TODO SQL :  use models & connector ?
        /* Authors: new Authors({ connector: SQLConnector }),
         Posts: new Posts({ connector: SQLConnector }),*/

        /* Authors: new Authors({ connector: db.authors }),
         Posts: new Posts({ connector: db.posts }),*/

        Authors: db.authors,
        Posts: db.posts,
        Fortunes: new FortuneCookieModel({ connector: httpConnector }),
        session: request.session,
      },
    };
  })
);

graphQLServer.listen(GRAPHQL_PORT, () => {
  debug(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`);
});
