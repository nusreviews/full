const passport = require('passport');
const passportFacebook = require('passport-facebook');
const config = require('../config');

const passportConfig = {
    clientID: config.get('authentication.facebook.clientId'),
    clientSecret: config.get('authentication.facebook.clientSecret'),
    callbackURL: 'http://api.nusreviews.com/auth/facebook/callback'
};

const createUser = function(displayName, profileId) {
    let newUser =  {
        profileId: profileId,
        displayName: displayName
    };
    let newUserJSON = JSON.stringify(newUser);
    redisClient.hsetAsync('users', profileId, newUserJSON);
    return newUserJSON;
};

if (passportConfig.clientID) {
    passport.use(new passportFacebook.Strategy(passportConfig, (accessToken, refreshToken, profile, done) => {
        redisClient.hgetAsync('users', profile.id).then((userJSON) => {
            if (!userJSON) {
                userJSON = createUser(profile.displayName, profile.id);
            }
            let user = JSON.parse(userJSON);
            return done(null, user);
        });
    }));
}