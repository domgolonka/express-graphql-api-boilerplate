/* eslint-disable max-len */
import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import { before as beforeUtil } from '../test/utils';

describe('Server', () => {
  let server;
  beforeEach((done) => {
    beforeUtil()
      .then((listeningServer) => {
        server = listeningServer;
        done();
      });
  });
  afterEach((done) => {
    mongoose.connection.close();
    server.close(done);
  });

  it('responds to /logout', (done) => {
    request(server)
      .get('/logout')
      .expect(200, done);
  });

  describe('Successfully Login', () => {
    let token;
    it('Returns success and the correct status code', (done) => {
      request(server)
        .post('/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .expect(200)
        .then((res) => {
          res.body.should.have.property('token');
          token = res.body.token;
        })
        .then(done)
        .catch(done);
    });

    it('Returns profile', (done) => {
      request(server)
        .get('/profile')
        .set('authorization', `JWT ${token}`)
        .send({
          username: 'admin',
          password: 'admin',
        })
        .expect(200)
        .then((res) => {
          res.body.should.have.property('username', 'admin');
          res.body.should.not.have.property('password');
        })
        .then(done)
        .catch(done);
    });
  });

  describe('Forbidden access', () => {
    it('Returns forbidden', (done) => {
      request(server)
        .get('/profile')
        .expect(401, done);
    });
  });

  describe('User not found', () => {
    it('Returns 403 for bad username', (done) => {
      request(server)
        .post('/login')
        .send({
          username: 'toto',
          password: 'toto',
        })
        .expect(403)
        .then(() => done())
        .catch(done);
    });
    it('Returns 403 for bad password', (done) => {
      request(server)
        .post('/login')
        .send({
          username: 'admin',
          password: 'toto',
        })
        .expect(403)
        .then(() => done())
        .catch(done);
    });
  });
});
