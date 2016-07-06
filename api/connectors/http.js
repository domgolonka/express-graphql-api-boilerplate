// TODO integrate dataloader
const debug = require('debug')('express-graphql-api-boilerplate:api/connectors/http');
import rp from 'request-promise';

export class HttpConnector {
  get({ url }) {
    const opts = {
      uri: url,
      json: true,
      // resolveWithFullResponse: true
    };
    debug(`GET ${opts.uri}`);
    return rp(opts);
  }
}
