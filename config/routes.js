var async = require('async');

module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signout', users.signout);

    // Users API - Internal
        app.get('/api/users/me',        users.me);
        app.post('/api/users/me',       users.session);
        app.get('/api/users/:username', users.show);

        //Finish with setting up the userId param
        app.param('username', users.user);

    // Retailer API - Internal
        var retailers = require('../app/controllers/retailers');
        app.get('/retailers/search', retailers.search);

    // Medley API - Internal
        var medleys = require('../app/controllers/medleys');
        app.post('/api/m',                                          auth.requiresLogin, medleys.create);
        app.get('/api/m/short_id/:shortId',                         medleys.show);
        app.del('/api/m/short_id/:shortId',                         auth.requiresLogin, auth.medley.hasAuthorization, medleys.destroy);
        app.get('/api/m/short_id/:shortId/updateviewcount',         medleys.updateViewCount);
        app.get('/api/m/short_id/:shortId/updatevotecount',         auth.requiresLogin, medleys.updateVoteCount);
        app.get('/api/m/by_user/:userId',                           medleys.getUserMedleys);
        app.get('/api/m/by_hashtag/:hashtag',                       medleys.getByHashtag);
        app.get('/api/m/by_votes',                                  medleys.most_voted);
        app.get('/api/m/by_views',                                  medleys.most_viewed);
        app.get('/api/m/by_date',                                   medleys.most_recent);
 
        //Finish with setting up the shortId param
        app.param('shortId', medleys.medley);

    // Vote API - Internal
        var votes = require('../app/controllers/votes');
        app.get('/votes/findByMedleyAndUserId', votes.findByMedleyAndUserId);
        app.post('/votes',                      auth.requiresLogin, votes.create);
        app.del('/votes/:voteId',               votes.destroy);

        //Finish with setting up the voteId param
        app.param('voteId', votes.vote);

    // Client API - Internal
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

    //Home route
    var index = require('../app/controllers/index');
    app.get('/:shortId', index.show_redirect);
    app.get('/'        , index.render);

};