import { tester } from 'graphql-tester';
import { create as createExpressWrapper } from 'graphql-tester/lib/main/servers/express';
import mongoose from 'mongoose';

import { graphQLServer } from '../';


describe('HttpResolvers', () => {
  afterEach(() => mongoose.connection.close());

  const graphqlTest = tester({
    url: '/graphql',
    server: createExpressWrapper(graphQLServer),
  });

  describe('Successfully getting the a fortune', () => {
    const response = graphqlTest(`{ 
      fortuneCookie {
        message
      }
    }`);

    it('Returns success and the correct status code', () => {
      return Promise.all([
        response.should.eventually.have.property('success').equal(true),
        response.should.eventually.have.property('status').equal(200),
      ]);
    });

    it('Returns a fortune with message', () => {
      return response.should.eventually.have.deep.property('data.fortuneCookie.message');
    });
  });
});
