// Module dependencies.
var mongoose        = require('mongoose'),
    async           = require('async'),
    shortId         = require('short-mongo-id'),
    Medley          = mongoose.model('Medley'),
    _               = require('underscore');


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
    console.log("Creating: ", medley);
    medley.user = req.user;
    medley.short_id = shortId(medley._id);
    console.log("Medley short id created: ", medley.short_id);
    medley.save(function(err) {
        if (err) {
            console.log(err);
        } else {
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



