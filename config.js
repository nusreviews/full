const convict = require('convict');

const config = convict({
    http: {
        port: {
            doc: 'The port to listen on',
            default: 3000,
            env: 'PORT'
        }, 
        ip: {
            doc: 'The ip to listen on', 
            default: '127.0.0.1', 
            env: 'IP'
        }
    },
    authentication: {
        facebook: {
            "clientId": {
                "doc": "The Client ID from Facebook to use for authentication",
                "default": "",
                "env": "FACEBOOK_CLIENT_ID"
            },
            "clientSecret": {
                "doc": "The Client Secret from Facebook to use for authentication",
                "default": "",
                "env": "FACEBOOK_CLIENT_SECRET"
            }
        },
        token: {
            secret: {
                doc: 'The signing key for the JWT',
                default: '$rE3@wQ1',
                env: 'JWT_SIGNING_KEY'
            },
            issuer: {
                doc: 'The issuer for the JWT',
                default: 'social-logins-spa'
            },
            audience: {
                doc: 'The audience for the JWT',
                default: 'social-logins-spa'
            }
        }
    }
});

config.validate();

module.exports = config;