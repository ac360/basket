/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Medley = mongoose.model('Medley'),
    _ = require('underscore');


// Find Medley by id
exports.medley = function(req, res, next, id) {
    Medley.find({short_id: req.params.shortId}).populate('user', 'name username').exec(function(err, medleys) {
        if (err) return next(err);
        if (medleys.length > 0) {
            req.medley = medleys[0];
        } else {
            console.log("Error, couldn't find medley");
            req.medley = null;
        }
        next();
    });
};

// Create a Medley
exports.create = function(req, res) {
    var medley = new Medley(req.body);
    console.log("Creating: ", req.body);
    medley.user = req.user;
    Medley.count(function(err, c) {
        console.log('Short ID is ' + c);
        medley.short_id = c + 1;
        medley.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                res.jsonp(medley);
            }
        });
    });
};

/**
 * Update a Medley
 */
exports.update = function(req, res) {
    var medley = req.medley;

    medley = _.extend(medley, req.body);

    medley.save(function(err) {
        res.jsonp(medley);
    });
};

// Update View Count
exports.updateViewCount = function(req, res) {
    var medley = req.medley;

    medley.views = medley.views + 1;

    medley.save(function(err) {
        res.jsonp(medley);
    });
};

// Update View Count
exports.updateVoteCount = function(req, res) {
    console.log(req.query);
    var medley   = req.medley;
    if (req.query.vote == 'true') {
        medley.votes = medley.votes + 1;
    } else if (req.query.vote == 'false') {
        medley.votes = medley.votes - 1;
    };
    medley.save(function(err) {
        res.jsonp(medley);
    });
};

/**
 * Delete an Medley
 */
exports.destroy = function(req, res) {
    var medley = req.medley;

    medley.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(medley);
        }
    });
};

/**
 * Show an Medley
 */
exports.show = function(req, res) {
    res.jsonp(req.medley);
};

// All Medleys For A Town
exports.all = function(req, res) {
    if (req.query.google_place_id) {
        Medley.find({ google_place_id: req.query.google_place_id }).limit(20).sort('-created').populate('user', 'name username').exec(function(err, medleys) {
            // Loop Through And Remove User Info if Anonymous is true
            medleys.forEach(function(medley, index){
                if (medley.anonymous === true) {
                    medley.user = null;
                };
            });
            // Render Results
            if (err) {
                res.render('error', { status: 500 }); 
            } else {
                res.jsonp(medleys);
            }
        });
    } else {
        res.render('error', { status: 500 }); 
    }
};

// Search Medleys
 exports.search = function(req, res) {
    Medley.find({'GroupName':gname}).sort('-created').populate('user', 'name username').exec(function(err, medleys) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(medleys);
        }
    });
};
