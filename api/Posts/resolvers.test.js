/* eslint-disable max-len */
import mongoose from 'mongoose';
import { fetch, before as beforeUtil, getToken } from '../../test/utils';

describe('Authors and Posts', () => {
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


  it('Successfully get the lastName of Author Maurine', (done) => {
    fetch(server, token, `{ 
      author(firstName: "Maurine") { firstName lastName }
     }`)
      .expect(200)
      .then((res) => {
        res.body.should.have.deep.property('data.author.firstName', 'Maurine');
        res.body.should.have.deep.property('data.author.lastName', 'Rau');
      })
      .then(done)
      .catch(done);
  });


  it('Successfully add a new author', (done) => {
    fetch(server, token, `mutation createToto {
      createAuthor(firstName: "toto", lastName: "titi") {
        id firstName lastName
      }
    }`)
      .expect(200)
      .then((res) => {
        res.body.should.have.deep.property('data.createAuthor.id');
        res.body.should.have.deep.property('data.createAuthor.firstName', 'toto');
        res.body.should.have.deep.property('data.createAuthor.lastName', 'titi');
      })
      .then(() => {
        return fetch(server, token, `{
          author(firstName: "toto") { id firstName lastName }
        }`)
          .expect(200)
          .then((res) => {
            res.body.should.have.deep.property('data.author.id');
            res.body.should.have.deep.property('data.author.firstName', 'toto');
            res.body.should.have.deep.property('data.author.lastName', 'titi');
          });
      })
      .then(done)
      .catch(done);
  });

  it('Successfully get every authors', (done) => {
    fetch(server, token, `{ 
      authors { firstName lastName }
     }`)
      .expect(200)
      .then((res) => {
        res.body.should.have.deep.property('data.authors.length', 6);
      })
      .then(done)
      .catch(done);
  });
});
