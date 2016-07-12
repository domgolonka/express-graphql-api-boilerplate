/* eslint-disable max-len */
import mongoose from 'mongoose';
import { fetch, before as beforeUtil, getToken } from '../../test/utils';

describe('MongoResolvers', () => {
  let server;
  let token;
  beforeEach((done) => {
    beforeUtil()
      .then((listeningServer) => {
        server = listeningServer;
        return listeningServer;
      })
      .then(getToken.bind(null, 'admin', 'admin'))
      .then((_token) => {
        token = _token;
      })
      .then(done)
      .catch(done);
  });
  afterEach((done) => {
    mongoose.connection.close();
    server.close(done);
  });


  it('Successfully get the description of company 999', (done) => {
    fetch(server, token, `{
        company(siren: "999") { id siren description }
       }`)
      .expect(200)
      .then((res) => {
        res.body.should.have.deep.property('data.company.id');
        res.body.should.have.deep.property('data.company.siren', '999');
        res.body.should.have.deep.property('data.company.description', 'great company');
      })
      .then(done)
      .catch(done);
  });

  it('Successfully add a new company', (done) => {
    fetch(server, token, `mutation createGreatCompany2 {
      createCompany(siren: "125", description: "great company 2") {
        id siren description
      }
    }`)
      .expect(200)
      .then((res) => {
        res.body.should.have.deep.property('data.createCompany.id');
        res.body.should.have.deep.property('data.createCompany.siren', '125');
        res.body.should.have.deep.property('data.createCompany.description', 'great company 2');
      })
      .then(() => {
        return fetch(server, token, `{
          company(siren: "125") { id siren description }
        }`)
          .expect(200)
          .then((res) => {
            res.body.should.have.deep.property('data.company.id');
            res.body.should.have.deep.property('data.company.siren', '125');
            res.body.should.have.deep.property('data.company.description', 'great company 2');
          })
          .then(done);
      })
      .catch(done);
  });

  it('Successfully get every companies', (done) => {
    fetch(server, token, `{ 
      companies { id siren description }
     }`)
      .expect(200)
      .then((res) => {
        res.body.should.have.deep.property('data.companies.length', 2);
      })
      .then(done)
      .catch(done);
  });
});
