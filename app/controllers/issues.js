/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Issue = mongoose.model('Issue'),
    _ = require('underscore');


// Find issue by id
exports.issue = function(req, res, next, id) {
    Issue.load(id, function(err, issue) {
        if (err) return next(err);
        if (!issue) return next(new Error('Failed to load issue ' + id));
        req.issue = issue;
        next();
    });
};

// Create a issue
exports.create = function(req, res) {
    var issue = new Issue(req.body);
    console.log(req.body);
    issue.user = req.user;

    issue.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(issue);
        }
    });
};

/**
 * Update a issue
 */
exports.update = function(req, res) {
    var issue = req.issue;

    issue = _.extend(issue, req.body);

    issue.save(function(err) {
        res.jsonp(issue);
    });
};

/**
 * Delete an issue
 */
exports.destroy = function(req, res) {
    var issue = req.issue;

    issue.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(issue);
        }
    });
};

/**
 * Show an issue
 */
exports.show = function(req, res) {
    res.jsonp(req.issue);
};

// All Issues For A Town
exports.all = function(req, res) {
    if (req.query.google_place_id) {
        Issue.find({ google_place_id: req.query.google_place_id }).limit(20).sort('-created').populate('user', 'name username').exec(function(err, issues) {
            // Loop Through And Remove User Info if Anonymous is true
            issues.forEach(function(issue, index){
                if (issue.anonymous === true) {
                    issue.user = null;
                };
            });
            // Render Results
            if (err) {
                res.render('error', { status: 500 }); 
            } else {
                res.jsonp(issues);
            }
        });
    } else {
        res.render('error', { status: 500 }); 
    }
};

// Search Issues
 exports.search = function(req, res) {
    Issue.find({'GroupName':gname}).sort('-created').populate('user', 'name username').exec(function(err, issues) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(issues);
        }
    });
};

// Issues by City
 exports.city = function(req, res, id) {
    Issue.find({google_place_id: id}).sort('-created').exec(function(err, issues) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            console.log(issues);
            res.jsonp(issues);
        }
    });
};