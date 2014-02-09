// Module dependencies
var mongoose    = require('mongoose'),
    async       = require('async'),
    Medley      = mongoose.model('Medley'),
    User        = mongoose.model('User'),
    Folder      = mongoose.model('Folder'),
    _           = require('underscore');

// Find Folder by Id
exports.folder = function(req, res, next, id) {
    Folder.load(id, function(err, folder) {
        if (err) return next(err);
        if (!folder) return next(new Error('Failed to load folder ' + id));
        req.folder = folder;
        next();
    });
};

// Get User's Folders
exports.getByUser = function(req, res) {
    if (req.user) {
        Folder.find({ user: req.user }).sort({ created: 1 }).populate('user', 'name username').exec(function(err, folders) {
            res.jsonp(folders);
        });
    } else {
        res.jsonp({error: 'User Not Logged In'});
    }
};

// Create Folder
exports.create = function(req, res) {
    var folder      = new Folder();
    folder.user     = req.user;
    folder.title    = req.body.title;
    folder.save(function(err) {
        if (err) {
            console.log("Error: ", err);
        } else {
            res.jsonp(folder);
        }
    });
};

// Update Folder
exports.update = function(req, res) {
    if (req.user.id === req.folder.user.id) {
            folder          = req.folder;
            folder.title    = req.body.title;
            folder.medleys  = req.body.medleys;
            folder.save(function(err) {
                if (err) {
                    console.log("Error: ", err);
                } else {
                    res.jsonp(folder);
                }
            });
    } else {
        console.log("User not authorized to delete this folder");
        res.jsonp({error: "Folder couldn't be deleted", err: err })
    }; 
};

// Delete Folder
exports.destroy = function(req, res) {
    var folder = req.folder;
    if (req.user.id === req.folder.user.id) {
        folder.remove(function(err) {
            if (err) {
                res.jsonp({error: "Folder couldn't be deleted", err: err})
            } else {
                res.jsonp(folder);
            };
        });
    } else {
        console.log("User not authorized to delete this folder");
        res.jsonp({error: "Folder couldn't be deleted", err: err })
    };  
};
