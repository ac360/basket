// Module dependencies
var mongoose = require('mongoose'),
    async = require('async'),
    Medley = mongoose.model('Medley'),
    User  = mongoose.model('User'),
    Vote  = mongoose.model('Vote'),
    _ = require('underscore');

// Find Vote by Id
exports.vote = function(req, res, next, id) {
    Vote.load(id, function(err, vote) {
        if (err) return next(err);
        if (!vote) return next(new Error('Failed to load vote ' + id));
        req.vote = vote;
        next();
    });
};

// Create Vote
exports.create = function(req, res) {
    var vote     = new Vote();
    vote.user    = req.user;
    vote.medley  = req.body.medley;

    vote.save(function(err) {
        if (err) {
            console.log("Error: ", err);
        } else {
            res.jsonp(vote);
        }
    });
};

// Delete Vote
exports.destroy = function(req, res) {
    var vote = req.vote;

    vote.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(vote);
        }
    });
};

// Find Vote
exports.findByMedleyAndUserId = function(req, res, id) {
	console.log(req.query);

    Vote.find({ medley: req.query.medley, user: req.user }).exec(function(err, vote) {
        console.log("Vote Search Result: ", vote);
        if (err) {
            console.log(err);
        } else {
            if (vote.length < 1) {
                errors        = {};
                errors.errors = {};
                errors.errors.message = "No Records Found";
                errors.errors.code    = 404;
                res.jsonp(errors);
            } else {
                vote = vote[0];
                res.jsonp(vote);
            };
        };
    });
};
