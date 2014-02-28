// Module dependencies.
var mongoose    = require('mongoose'),
    User        = mongoose.model('User'),
    Folder      = mongoose.model('Folder'),
    _           = require('underscore');


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
    delete user.timezone
    delete user.provider
    delete user.hashed_password
    delete user.salt
    res.jsonp(user);
};

// Send User
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

// Update Current User
exports.updateCurrent = function(req, res) {
    console.log("Recevieved: ", req.body);
    var user = req.user
    if ( !req.body.current_password || !user.authenticate(req.body.current_password) ) {
        res.jsonp({ error: "The Current Password You Entered Is Not Correct" });
        return;
    };
    if ( req.body.password && req.body.password.length < 8 ) {
        res.jsonp({ error: "Sorry, your New Password must be longer than 8 characters" });
        return;
    } else {
        user     = _.extend(user, req.body);
        user.save(function(err, user) {
            if (err) { 
                console.log(err); 
                // Error handling for uniqueness violations
                if (err.code === 11001) {
                    if (err.err.indexOf("email") != -1) {
                        res.jsonp({ error: "Email Address Already In Use"});
                        return;
                    } else if (err.err.indexOf("username") != -1) {
                        res.jsonp({ error: "Username Already Taken"});
                        return;
                    }
                } // if err.code
            };
            var user = user.toObject();
            delete user.fb_id
            delete user.timezone
            delete user.provider
            delete user.hashed_password
            delete user.salt
            res.jsonp(user);
        });
    } // if current password is correct
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
                    });
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

// Register - Manual
exports.registerManual = function(req, res) {
    var user         = new User(req.body);
    user.provider    = 'local';
    user.save(function(err, user) {
        if (err) {
            // 11000 is an error triggered by MongoDb for uniqueness validations
            if (err.code === 11000) {
                console.log("Registration Error: ", err.err)
                if (err.err.indexOf('email') > -1) {
                   res.jsonp({ error: "Email is already registered" }); 
                };
                if (err.err.indexOf('username') > -1) {
                   res.jsonp({ error: "Sorry, that Username is already in use" }); 
                };
            } else {
                console.log("Registration Error: ", err);
                res.jsonp({ error: "Sorry, Registration Is Not Currently Working" });
            };
        } else {
            console.log("New User Created Through Maual Registration: ", user);
            // Create A Favorites Folder
            var folder = new Folder({ user: user, title: 'Favorites' });
            folder.save(function(err){
                if (err) { console.log("Folder Creation Error:", err) };
            });
            // Log In User
            req.logIn(user, function(err) {
                if (err) { 
                    console.log(err);
                    res.jsonp({ error: "Sorry, something wen't wrong logging user in after registration" }) 
                } else {
                    req.user = req.user.toObject();
                    delete req.user.hashed_password
                    delete req.user.salt
                    delete req.user.provider
                    res.jsonp(req.user);
                }
            }); // logIn
        } // if (err)
    }); // user.save
}; //registerManual

// Log In - Manual
exports.loginManual = function(req, res) {
    var self = this;
    User.findOne({ email: req.body.email }).exec(function(err, user) {
        if (err)  { 
            console.log(err);
            res.jsonp({ error: "Sorry, something wen't wrong" }); 
        } else if (user) {
            if (user.provider == "facebook") {
                res.jsonp({ error: "Since You Registered through Facebook, Please Use The Facebook Sign In Button Below" });
            } else if ( user.authenticate(req.body.password) ) {
                req.login(user, function(err) {
                    if (err) { 
                        console.log(err);
                        res.jsonp({ error: "Sorry, something wen't wrong" });
                    } else {
                        req.user = req.user.toObject();
                        delete req.user.hashed_password
                        delete req.user.salt
                        delete req.user.provider
                        res.jsonp(req.user);
                    };
                }); // req.login
            } else {
                res.jsonp( { error: "Incorrect Email/Password" } );
            }
        } else {
            res.jsonp( { error: "That Email Is Not Registered" } );
        }
    });
};




