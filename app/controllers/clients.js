/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    OAuthClient = mongoose.model('OAuthClient'),
    _ = require('underscore');


/**
 * Find client by id
 */
exports.client = function(req, res, next, id) {
    OAuthClient.load(id, function(err, client) {
        if (err) return next(err);
        if (!client) return next(new Error('Failed to load client ' + id));
        req.client = client;
        next();
    });
};

/**
 * Create a client
 */
exports.create = function(req, res) {
    var client = new OAuthClient(req.body);

    client.user = req.user;
    client.save();
    res.jsonp(client);
};

/**
 * Update a client
 */
exports.update = function(req, res) {
    var client = req.client;

    client = _.extend(client, req.body);

    client.save(function(err) {
        res.jsonp(client);
    });
};

/**
 * Delete an client
 */
exports.destroy = function(req, res) {
    var client = req.client;

    client.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(client);
        }
    });
};

/**
 * Show an client
 */
exports.show = function(req, res) {
    res.jsonp(req.client);
};

/**
 * List of OAuthClients
 */
exports.all = function(req, res) {
    OAuthClient.find().sort('-created').exec(function(err, clients) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(clients);
        }
    });
};