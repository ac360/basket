// Module dependencies.
var mongoose = require('mongoose'),
    async = require('async'),
    Medley = mongoose.model('Medley'),
    _ = require('underscore');

exports.render = function(req, res) {
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};

exports.testWidget = function(req, res) {
    res.render('test');
};

exports.show_redirect = function(req, res) {
	console.log("PARAMS: ", req.params);
	Medley.find({ short_id: req.params.shortId }, function(err, medley) {
        if (err) { 
            res.redirect('/') 
        } else {
            req.medley = medley[0];
            res.redirect('/#!/m/'+req.medley.short_id);
        };
    });
};