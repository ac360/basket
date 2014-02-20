var async = require('async');

module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signout', users.signout);

    // Users API - Internal
        app.get('/api/users/me',        users.me);
        app.put('/api/users/me',        users.updateCurrent);
        app.post('/api/users/me',       users.session);
        app.get('/api/users/:username', users.show);

        //Finish with setting up the userId param
        app.param('username', users.user);

    // Retailer API - Internal
        var retailers = require('../app/controllers/retailers');
        app.get('/retailers/search', retailers.search);

    // Admin API - Internal
        var admin = require('../app/controllers/admin');
        app.get('/api/a/users',                         admin.getUsers);
        app.get('/api/a/delete_tests',                  admin.deleteTests);

    // Medley API - Internal
        var medleys = require('../app/controllers/medleys');
        app.post('/api/m',                                          auth.requiresLogin, medleys.create);
        app.get('/api/m/short_id/:shortId',                         medleys.show);
        app.del('/api/m/short_id/:shortId',                         auth.requiresLogin, auth.medley.hasAuthorization, medleys.destroy);
        app.get('/api/m/short_id/:shortId/updateviewcount',         medleys.updateViewCount);
        app.get('/api/m/short_id/:shortId/updatevotecount',         auth.requiresLogin, medleys.updateVoteCount);
        app.get('/api/m/by_user/:username',                         medleys.getByUsername);
        app.get('/api/m/by_hashtag/:hashtag',                       medleys.getByHashtag);
        app.get('/api/m/by_folder/:folderId',                       medleys.getByFolder);
        app.get('/api/m/by_votes',                                  medleys.getByVotes);
        app.get('/api/m/by_views',                                  medleys.getByViews);
        app.get('/api/m/by_date',                                   medleys.getByDate);
        app.get('/api/m/by_featured',                               medleys.getByFeatured);
 
        //Finish with setting up the shortId param
        app.param('shortId', medleys.medley);

    // Vote API - Internal
        var votes = require('../app/controllers/votes');
        app.get('/votes/findByMedleyAndUserId', votes.findByMedleyAndUserId);
        app.post('/votes',                      auth.requiresLogin, votes.create);
        app.del('/votes/:voteId',               votes.destroy);

        //Finish with setting up the voteId param
        app.param('voteId', votes.vote);

    // Folder API - Internal
        var folders = require('../app/controllers/folders');
        app.get('/api/f',                     auth.requiresLogin, folders.getByUser);
        app.post('/api/f',                    auth.requiresLogin, folders.create);
        app.put('/api/f/:folderId',           auth.requiresLogin, folders.update);
        app.del('/api/f/:folderId',           auth.requiresLogin, folders.destroy);
        //Finish with setting up the folderId param
        app.param('folderId', folders.folder);

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