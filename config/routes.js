var async = require('async');

module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);

    // Users API - Internal
    app.post('/users/signup', users.create);
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: 'Invalid email or password.'
    }), users.session);
    app.get('/users/me', users.me);
    app.get('/users/:userId', users.show);

    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

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

    //Issue Routes
    var issues = require('../app/controllers/issues');
    app.get('/issues', issues.all);
    app.post('/issues', auth.requiresLogin, issues.create);
    app.get('/issues/city/:cityId', issues.city);
    app.get('/issues/:issueId', issues.show);
    app.put('/issues/:issueId', auth.requiresLogin, auth.issue.hasAuthorization, issues.update);
    app.del('/issues/:issueId', auth.requiresLogin, auth.issue.hasAuthorization, issues.destroy);

    //Issue Routes
    var cities = require('../app/controllers/cities');
    app.get('/cities/:cityName', cities.search);

    //Finish with setting up the issueId param
    app.param('issueId', issues.issue);

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
    app.get('/api/v1/issues', passport.authenticate('bearer', { session: false }), issues.all);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};