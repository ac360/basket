// Module dependencies.
var mongoose = require('mongoose'),
    User = mongoose.model('User');

// Auth callback
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

// Show login form - TODO - Security vulnerability!  Anyone can submit an ID and be authorized!!!  Research how to do this more securely!
exports.signin = function(req, res) {
    User.findOne({ fb_id: req.body.userID })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.logIn(user, function(err) {
                if (err) return next(err);
                res.jsonp(req.user);
            });
        });
};

// Show sign up form
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

// Logout
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

// Session
exports.session = function(req, res) {
    console.log("REQ.BODY: ", req.body);
    User.findOne({ email: req.body.email })
    .exec(function(err, user) {
        console.log("User Search Results: ", user);
        if (err){console.log("Error: ", err)};
        if (!user) {
                console.log("User doesn't exist, creating new user");
                // Create A User
                var user = new User(req.body);
                user.save(function(err) {
                    if (err) {
                        console.log(err)
                        // 11000 is an error triggered by MongoDb for uniqueness validations
                        if (err.code === 11000) {
                            console.log("You tried to create a user since its email was not found in the database, however the following duplicate key error has been thrown...", err)
                            err.errors = [];
                            var value = err.err.match(/"([^"]+)"/)[1] + " is already in use";
                            err.errors.push(value);
                            return next(err);
                        };
                    };
                    console.log("User successfully created, logging them in...")
                    req.logIn(user, function(err) {
                        console.log("User Logged In");
                        if (err) return next(err);
                        res.jsonp(req.user);
                    });
                });
        } else {
            console.log("User Found, logging them in...");
            req.logIn(user, function(err) {
                if (err) return next(err);
                console.log("User Logged In");
                res.jsonp(req.user);
            });
        }; 
    });
};

// Create user
exports.create = function(req, res) {
    var user = new User(req.body);
    user.save(function(err) {
        if (err) {
            console.log(err)
            // 11000 is an error triggered by MongoDb for uniqueness validations
            if (err.code === 11000) {
                err.errors = [];
                var value = err.err.match(/"([^"]+)"/)[1] + " is already in use";
                err.errors.push(value);
                return res.render('users/signup', {
                    errors: err.errors,
                    user: user
                });
            };
            return res.render('users/signup', {
                errors: err.errors,
                user: user
            });
        }
        req.logIn(user, function(err) {
            console.log("HERE!")
            if (err) return next(err);
            res.jsonp(req.user);
        });
    });
};

//  Show profile
exports.show = function(req, res) {
    var user = req.profile;

    res.render('users/show', {
        title: user.name,
        user: user
    });
};

// Send User
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

// Find user by id
exports.user = function(req, res, next, id) {
    User.findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};