/* eslint-disable max-len */
import mongoose from 'mongoose';
import { fetch, before as beforeUtil, getToken } from '../../test/utils';

describe('Posts', () => {
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


  it('Successfully create a post for author Maurine', (done) => {
    fetch(server, token, `{ 
      author(firstName: "Maurine") { id }
     }`)
      .expect(200)
      .then((res) => res.body.data.author.id)
      .then((authorId) => {
        return fetch(server, token, `mutation create2ndMaurinePost {
          createPost(tags:"tag1", title:"2nd post", text:"great info", authorId:"${authorId}") {
            title
          }
        }`)
          .expect(200)
          .then((res) => {
            res.body.should.have.deep.property('data.createPost.title', '2nd post');
          });
      })
      .then(() => {
        return fetch(server, token, `{ 
          author(firstName: "Maurine") { posts { id author { lastName } } }
         }`)
          .expect(200)
          .then((res) => {
            res.body.should.have.deep.property('data.author.posts.length', 2);
            res.body.should.have.deep.property('data.author.posts[0].author.lastName', 'Rau');
          });
      })
      .then(done)
      .catch(done);
  });
});
