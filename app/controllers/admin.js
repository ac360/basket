// Module dependencies.
var mongoose        = require('mongoose'),
    async           = require('async'),
    shortId         = require('short-mongo-id'),
    Medley          = mongoose.model('Medley'),
    User            = mongoose.model('User'),
    Vote            = mongoose.model('Vote'),
    Folder          = mongoose.model('Folder'),
    events          = require('events'),
    eventEmitter    = new events.EventEmitter(),
    _               = require('underscore');

// Helpers


// Actions
    exports.getUsers = function(req, res) {
    	if (req.user && req.user.admin === true){
    		User.find().sort({created: -1}).limit(40).exec(function(err, users) {
	        	res.jsonp(users);
	        });
    	};
    };



