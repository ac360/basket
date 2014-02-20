// Module dependencies.
var mongoose    = require('mongoose'),
    User        = mongoose.model('User');
    Folder      = mongoose.model('Folder');


// Find user by username
exports.user = function(req, res, next, id) {
    User.findOne({ username: req.params.username }).exec(function(err, user) {
        if (err) { console.log(err) };
        if (user) {
            req.profile = user;
            next();
        } else {
            req.profile = null;
            next();
        };
    });
};

//  Show profile
exports.show = function(req, res) {
    var user = req.profile.toObject();
    delete user.email
    delete user.fb_id
    delete user.provider
    delete user.timezone
    res.jsonp(user);
};

// Send User
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

// Update Current User
exports.updateCurrent = function(req, res) {
    console.log("Recevieved: ", req.body);
    req.user.username  = req.body.username;
    req.user.affiliate = req.body.affiliate;
    req.user.email     = req.body.email;
    req.user.save(function(err, user){
        if (err) {return console.log("error")};
        res.jsonp(user);
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

                    console.log("User successfully created, logging them in...");
                    // Create A Favorites Folder
                    var folder = new Folder({ user: user, title: 'Favorites' });
                    folder.save(function(err){
                        if (err) {
                            console.log("Folder Creation Error:", err);
                        };
                    })
                    // Log In User
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
