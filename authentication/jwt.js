const passport = require('passport');
const passportJwt = require('passport-jwt');
const config = require('../config');

const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient();

const jwtOptions = {
    jwtFromRequest: passportJwt.ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.get('authentication.token.secret'),
    issuer: config.get('authentication.token.issuer'),
    audience: config.get('authentication.token.audience')
};

passport.use(new passportJwt.Strategy(jwtOptions, (payload, done) => {
    redisClient.hgetAsync('users', payload.sub).then((userJSON) => {
        if (userJSON) {
            return done(null, JSON.parse(userJSON), payload);
        } else {
            return done();
        }
    });
}));