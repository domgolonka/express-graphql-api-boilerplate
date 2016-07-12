import request from 'supertest-as-promised';
import config from 'config';
import path from 'path';

const apiPath = path.resolve(__dirname, '../api/index');

// util method to POST /graphql
export function fetch(server, token, gql) {
  return request(server)
    .post('/graphql?')
    .set('Content-Type', 'application/graphql')
    .set('Authorization', `JWT ${token}`)
    .send(gql);
}

export function before() {
  return new Promise((resolve) => {
    delete require.cache[require.resolve(apiPath)];
    let server = require(apiPath).app; // eslint-disable-line global-require
    server = server.listen(config.get('api.port'), () => resolve(server));
  });
}

export function getToken(username, password, server) {
  return request(server)
    .post('/login')
    .send({
      username,
      password,
    })
    .then((res) => res.body.token);
}