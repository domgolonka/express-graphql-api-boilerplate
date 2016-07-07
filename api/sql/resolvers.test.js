/* eslint-disable max-len */
import { tester } from 'graphql-tester';
import { create as createExpressWrapper } from 'graphql-tester/lib/main/servers/express';
import mongoose from 'mongoose';

import { graphQLServer } from '../';


describe('SQLResolvers', () => {
  afterEach(() => mongoose.connection.close());

  const graphqlTest = tester({
    url: '/graphql',
    server: createExpressWrapper(graphQLServer),
  });

  describe('Successfully getting the lastName of Author Maurine', () => {
    const response = graphqlTest(`{ 
      author(firstName:"Maurine") {
        firstName
        lastName
      }
    }`);

    it('Returns success and the correct status code', () => {
      return Promise.all([
        response.should.eventually.have.property('success').equal(true),
        response.should.eventually.have.property('status').equal(200),
      ]);
    });

    it('Returns the correct data', () => {
      return Promise.all([
        response.should.eventually.have.deep.property('data.author.firstName').equal('Maurine'),
        response.should.eventually.have.deep.property('data.author.lastName').equal('Rau'),
      ]);
    });
  });

  describe('Successfully add a new author', () => {
    const resCreateAuthor = graphqlTest(`mutation createToto {
      createAuthor(firstName: "toto", lastName: "titi") {
        id
        firstName
        lastName
      }
    }`);
    const resAuthorTiti = graphqlTest(`{ 
      author(firstName: "toto") {
        id
        firstName
        lastName
      }
    }`);

    it('Returns success and the correct status code', () => {
      return Promise.all([
        resCreateAuthor.should.eventually.have.property('success').equal(true),
        resCreateAuthor.should.eventually.have.property('status').equal(200),
        resCreateAuthor.should.eventually.have.property('errors').equal(undefined),
      ]);
    });

    it('Returns the correct data', () => {
      return Promise.all([
        resCreateAuthor.should.eventually.have.deep.property('data.createAuthor.id'),
        resCreateAuthor.should.eventually.have.deep.property('data.createAuthor.firstName').equal('toto'),
        resCreateAuthor.should.eventually.have.deep.property('data.createAuthor.lastName').equal('titi'),
      ]);
    });

    it('Then can be fetch', () => {
      return Promise.all([
        resAuthorTiti.should.eventually.have.property('success').equal(true),
        resAuthorTiti.should.eventually.have.property('status').equal(200),
        resAuthorTiti.should.eventually.have.property('errors').equal(undefined),
        resAuthorTiti.should.eventually.have.deep.property('data.author.id'),
        resAuthorTiti.should.eventually.have.deep.property('data.author.firstName').equal('toto'),
        resAuthorTiti.should.eventually.have.deep.property('data.author.lastName').equal('titi'),
      ]);
    });
  });

  describe('Successfully getting every authors', () => {
    const response = graphqlTest(`{ 
      authors {
        firstName
        lastName
      }
    }`);

    it('Returns success and the correct status code', () => {
      return Promise.all([
        response.should.eventually.have.property('success').equal(true),
        response.should.eventually.have.property('status').equal(200),
        response.should.eventually.have.property('errors').equal(undefined),
      ]);
    });

    it('Returns the correct number of authors', () => {
      return Promise.all([
        response.should.eventually.have.deep.property('data.authors.length').equal(6),
      ]);
    });
  });
});
