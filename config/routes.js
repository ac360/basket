var async = require('async');

module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signout', users.signout);

    // Users API - Internal
    app.get('/users/me', users.me);
    app.post('/users/me', users.session);
    app.get('/users/:userId', users.show);

    //Setting the facebook oauth routes
    // app.get('/auth/facebook', passport.authenticate('facebook', {
    //     scope: ['email', 'user_about_me'],
    //     failureRedirect: '/signin'
    // }), users.signin);

    // app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    //     failureRedirect: '/signin'
    // }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    // Retailer Routes
    var retailers = require('../app/controllers/retailers');
    app.get('/retailers/search', retailers.search);

    //medley Routes
    var medleys = require('../app/controllers/medleys');
    app.get('/medleys', medleys.all);
    app.post('/medleys', auth.requiresLogin, medleys.create);
    app.get('/medleys/:shortId', medleys.show);
    app.put('/medleys/:shortId', auth.requiresLogin, auth.medley.hasAuthorization, medleys.update);
    app.del('/medleys/:shortId', auth.requiresLogin, auth.medley.hasAuthorization, medleys.destroy);
    app.get('/medleys/:shortId/updateviewcount', medleys.updateViewCount);
    app.get('/medleys/:shortId/updatevotecount', auth.requiresLogin, medleys.updateVoteCount);

    //Finish with setting up the shortId param
    app.param('shortId', medleys.medley);

    //Vote Routess
    var votes = require('../app/controllers/votes');
    app.get('/votes/findByMedleyAndUserId', votes.findByMedleyAndUserId);
    app.post('/votes',                      auth.requiresLogin, votes.create);
    app.del('/votes/:voteId',               votes.destroy);

    //Finish with setting up the voteId param
    app.param('voteId', votes.vote);

    //Client Routes
    var clients = require('../app/controllers/clients');
    app.get('/clients', clients.all);
    app.post('/clients', auth.requiresLogin, clients.create);
    app.get('/clients/:clientId', clients.show);
    app.put('/clients/:clientId', auth.requiresLogin, auth.client.hasAuthorization, clients.update);
    app.del('/clients/:clientId', auth.requiresLogin, auth.client.hasAuthorization, clients.destroy);

    // Set up OAuth2 routes handling
    var oauth2 = require('./middlewares/oauth2');
    app.get('/oauth/authorize', auth.requiresLogin, oauth2.authorization, oauth2.dialog);
    app.post('/oauth/authorize/decision', auth.requiresLogin, oauth2.server.decision());
    app.post('/oauth/token', oauth2.token);

    //Finish with setting up the clientId param
    app.param('clientId', clients.client);

    // External API V1 Endpoints
    app.get('/api/v1/medleys', passport.authenticate('bearer', { session: false }), medleys.all);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/:shortId', index.show_redirect);
    app.get('/'        , index.render);

};