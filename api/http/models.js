export class FortuneCookie {
  constructor({ connector }) {
    this.connector = connector;
  }

  getOne() {
    return this.connector.get({ url: 'http://fortunecookieapi.com/v1/cookie' })
      .then((res) => {
        return res.length > 0 ? res[0].fortune : res;
      });
  }
}
