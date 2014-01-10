// Module dependencies
var mongoose = require('mongoose'),
    async = require('async'),
    Issue = mongoose.model('Issue'),
    User  = mongoose.model('User'),
    Vote  = mongoose.model('Vote'),
    _ = require('underscore');

// Create Vote
exports.create = function(req, res) {
    var vote = new Vote(req.body);
    console.log(req.body);
    vote.user  = req.user;
    vote.issue = req.body.issue;

    vote.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(vote);
        }
    });
};

// Find Vote
exports.findByIssueAndUserId = function(req, res, id) {
	console.log(req.query);

    Vote.find({ issue: req.query.issue, user: req.query.user }).exec(function(err, vote) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            console.log(vote);
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
