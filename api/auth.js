import config from 'config';
import passport from 'passport';
import passportJWT from 'passport-jwt';

import { UserModel as User } from './mongo/models';

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const opts = {
  secretOrKey: config.get('token.secret'),
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  audience: config.get('token.audience'),
  issuer: config.get('token.issuer'),
};

passport.use(new Strategy(opts, (jwtPayload, done) => {
  User.findById(jwtPayload.id, '-password')
    .then((user) => user ? done(null, user) : done(null, false))
    .catch(done);
}));


export default passport;
export const authenticate = passport.authenticate('jwt', { session: false }).bind(passport);
