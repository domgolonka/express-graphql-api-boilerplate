/* eslint-disable max-len */
import { tester } from 'graphql-tester';
import { create as createExpressWrapper } from 'graphql-tester/lib/main/servers/express';
import mongoose from 'mongoose';

import { graphQLServer } from '../index';


describe('MongoResolvers', () => {
  afterEach(() => mongoose.connection.close());

  const graphqlTest = tester({
    url: '/graphql',
    server: createExpressWrapper(graphQLServer),
  });

  describe('Successfully getting the description of company 999', () => {
    const resCompany999 = graphqlTest(`{ 
        company(siren: "999") {
        id
        siren
        description
      }
    }`);

    it('Returns success and the correct status code', () => {
      return Promise.all([
        resCompany999.should.eventually.have.property('success').equal(true),
        resCompany999.should.eventually.have.property('status').equal(200),
        resCompany999.should.eventually.have.property('errors').equal(undefined),
      ]);
    });

    it('Returns the correct data', () => {
      return Promise.all([
        resCompany999.should.eventually.have.deep.property('data.company.id'),
        resCompany999.should.eventually.have.deep.property('data.company.siren').equal('999'),
        resCompany999.should.eventually.have.deep.property('data.company.description').equal('super société'), // eslint-disable-line max-len
      ]);
    });
  });

  describe('Successfully add a new company', () => {
    const resCreateCompany = graphqlTest(`mutation createGreatCompany {
      createCompany(siren: "125", description: "great company"){
        id
        siren
        description
      }
    }`);
    const resCompany125 = graphqlTest(`{ 
          company(siren: "125") {
          id
          siren
          description
        }
      }`);

    it('Returns success and the correct status code', () => {
      return Promise.all([
        resCreateCompany.should.eventually.have.property('success').equal(true),
        resCreateCompany.should.eventually.have.property('status').equal(200),
        resCreateCompany.should.eventually.have.property('errors').equal(undefined),
      ]);
    });

    it('Returns the correct data', () => {
      return Promise.all([
        resCreateCompany.should.eventually.have.deep.property('data.createCompany.id'),
        resCreateCompany.should.eventually.have.deep.property('data.createCompany.siren').equal('125'),
      ]);
    });

    it('Then can be fetch', () => {
      return Promise.all([
        resCompany125.should.eventually.have.property('success').equal(true),
        resCompany125.should.eventually.have.property('status').equal(200),
        resCompany125.should.eventually.have.property('errors').equal(undefined),
        resCompany125.should.eventually.have.deep.property('data.company.id'),
        resCompany125.should.eventually.have.deep.property('data.company.siren').equal('125'),
        resCompany125.should.eventually.have.deep.property('data.company.description').equal('great company'),
      ]);
    });
  });

  describe('Successfully getting every companies', () => {
    const response = graphqlTest(`{ 
      companies{
        siren
        description
        jobOffers {
          id
        }
      }
    }`);

    it('Returns success and the correct status code', () => {
      return Promise.all([
        response.should.eventually.have.property('success').equal(true),
        response.should.eventually.have.property('status').equal(200),
        response.should.eventually.have.property('errors').equal(undefined),
      ]);
    });

    it('Returns the correct number of companies', () => {
      return Promise.all([
        response.should.eventually.have.deep.property('data.companies.length').equal(2),
      ]);
    });
  });
})
;
