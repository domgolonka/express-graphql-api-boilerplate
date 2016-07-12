import mongoose from 'mongoose';
import { fetch, before as beforeUtil, getToken } from '../../test/utils';

describe('Fortune cookies', function FortuneCookiesTest () {
  this.timeout(0);
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

  it('Successfully get a fortune', (done) => {
    fetch(server, token, `{ 
      fortuneCookie { message }
     }`)
      .expect(200)
      .then((res) => {
        res.body.should.have.deep.property('data.fortuneCookie.message');
      })
      .then(done)
      .catch(done);
  });
});
