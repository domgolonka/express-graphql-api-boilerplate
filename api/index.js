/* eslint-disable prefer-arrow-callback, func-names */
const debug = require('debug')('express-graphql-api-boilerplate:api/index');

import { apolloServer } from 'apollo-server';
import Promise from 'bluebird';
const bodyParser = require('body-parser');
import config from 'config';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import logger from 'morgan';

import passport, { authenticate } from './auth';
import { HttpConnector } from './connectors';
import db from '../models';
import { schema, resolvers } from './schema';

import { CompanyModel } from './Companies';
import { FortuneCookieModel } from './Fortunes';
import { UserModel } from './Users';


jwt.sign = Promise.promisify(jwt.sign);

mongoose.Promise = Promise;
mongoose.connect(config.get('mongo.connString'))
  .then(() => debug('mongo connected'));


const PORT = config.get('api.port');
export const app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());


app.post('/login', function (req, res) {
  UserModel.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] })
    .then((user) => {
      if (!user) return Promise.reject(new Error('user not found'));

      return user.comparePassword(req.body.password)
        .then((isMatch) => {
          if (!isMatch) return Promise.reject(new Error('bad password'));

          return jwt.sign({ id: user.id }, config.get('token.secret'), {
            expiresIn: config.get('token.tokenExpiresIn'),
            audience: config.get('token.audience'),
            issuer: config.get('token.issuer'),
          });
        })
        .then((token) => res.json({ token }));
    })
    .catch(() => res.status(403).send('Authentication failed. Bad username or password.'));
});


// TODO logout
app.get('/logout', function (req, res) {
  req.logout(); // TODO useless because of token ? could invalidate token ?
  res.status(200).send();
});

// TODO reset password : new token tha expires after 12h
app.get('/profile',
  authenticate,
  function (req, res) {
    res.status(200).send(req.user);
  });

app.use(bodyParser.text({ type: 'application/graphql' }));
app.use('/graphql',
  // authenticate,
  apolloServer(request => {
    debug(request.headers);
    debug(`method ${request.method}`);
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

        Companies: CompanyModel,
        Authors: db.authors,
        Posts: db.posts,
        Fortunes: new FortuneCookieModel({ connector: httpConnector }),
        user: request.user,
      },
    };
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (config.get('env') === 'development') {
  app.use(function (err, req, res) {
    res
      .status(err.status || 500)
      .send({
        message: err.message,
        error: err,
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message,
      error: {},
    });
});


if (require.main === module) {
  app.listen(PORT, () => {
    debug(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
  });
}
