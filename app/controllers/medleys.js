// Module dependencies.
var mongoose        = require('mongoose'),
    async           = require('async'),
    shortId         = require('short-mongo-id'),
    Medley          = mongoose.model('Medley'),
    Vote            = mongoose.model('Vote'),
    _               = require('underscore');


// Find Medley by id
exports.medley = function(req, res, next, id) {
    Medley.find({ short_id: req.params.shortId }).populate('user', 'name username').exec(function(err, medleys) {
        if (err) return next(err);
        if (medleys[0] && medleys[0].short_id) {
            req.medley = medleys[0];
        } else {
            req.medley = null;
        };
        next();
    });
};

// Create a Medley
exports.create = function(req, res) {
    var medley = new Medley(req.body);
    console.log("Creating: ", medley);
    medley.user = req.user;
    medley.short_id = shortId(medley._id);
    medley.save(function(err, medley) {
        if (err) {
            console.log(err);
        } else {
            console.log("Medley Successfully Saved: ", medley);
            res.jsonp(medley);
        }
    });
};

// Update a Medley
exports.update = function(req, res) {
    var medley = req.medley;

    medley = _.extend(medley, req.body);

    medley.save(function(err) {
        res.jsonp(medley);
    });
};

// Update View Count
exports.updateViewCount = function(req, res) {
    req.medley.views = req.medley.views + 1;
    req.medley.save(function(err, medley) {
        res.jsonp(medley);
    });
};

// Update Vote Count
exports.updateVoteCount = function(req, res) {
    Vote.find({ medley: req.medley, user: req.user }).exec(function(err, vote) {
        if (err) {
            console.log(err);
            res.jsonp(err);
        } else {
            // User Vote Doesn't Exist
            if (vote.length < 1) {
                    var vote = new Vote({ medley: req.medley, user: req.user });
                    vote.save(function(err, vote) {
                        if (err) {
                            console.log(err);
                            res.jsonp(err);
                        } else {
                            req.medley.votes = req.medley.votes + 1;
                            req.medley.save(function(err, medley){
                                res.jsonp(medley);
                            })
                        }
                    });
            // User Vote Exists 
            } else {
                var vote = vote[0]
                vote.remove(function(err, vote){
                    if (err) {
                        console.log(err);
                        res.jsonp(err);
                    } else {
                        req.medley.votes = req.medley.votes - 1;
                        req.medley.save(function(err, medley){
                            res.jsonp(medley);
                        })
                    }
                })
            };
        };
    });
};

// Delete A Medley
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

// Show A Medley
exports.show = function(req, res) {
    res.jsonp(req.medley);
};

// Show Newest Medleys
exports.most_recent = function(req, res) {
    Medley.find().sort('-date').limit(6).populate('user', 'name username').exec(function(err, medleys) {
        console.log("Found medleys :", medleys.length);
        res.jsonp(medleys);
    });
};

// Show Most Voted Medleys
exports.most_voted = function(req, res) {
    Medley.find().sort({votes: -1}).limit(6).populate('user', 'name username').exec(function(err, medleys) {
        console.log("Found medleys :", medleys.length);
        res.jsonp(medleys);
    });
};

// Show Most Viewed Medleys
exports.most_viewed = function(req, res) {
    Medley.find().sort({views: -1}).limit(6).populate('user', 'name username').exec(function(err, medleys) {
        console.log("Found medleys :", medleys.length);
        res.jsonp(medleys);
    });
};



