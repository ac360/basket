// Module dependencies.
var mongoose        = require('mongoose'),
    async           = require('async'),
    shortId         = require('short-mongo-id'),
    Medley          = mongoose.model('Medley'),
    Vote            = mongoose.model('Vote'),
    events          = require('events'),
    eventEmitter    = new events.EventEmitter(),
    _               = require('underscore');

// Helpers
    
    // Add Voted Attribute
    add_voted_attribute = function(user, medley, callback) {
        if (user) {
                Vote.find({ medley: medley._id, user: user._id }).exec(function(err, vote) {
                    if (vote.length) {
                        medley       = medley.toObject();
                        medley.voted = true;
                        if (callback) { callback(medley) };
                    } else {
                        medley       = medley.toObject();
                        medley.voted = false;
                        if (callback) { callback(medley) };
                    };
                });
        } else { if (callback) { callback(medley) } };
    };

// Actions

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
                if (req.user) {
                    console.log("Medley Successfully Saved: ", medley);
                    add_voted_attribute(req, medley, function(medley){
                        res.jsonp(medley);
                    });
                } else {
                    res.jsonp(medley);
                };
            }
        });
    };

    // Update View Count
    exports.updateViewCount = function(req, res) {
        req.medley.views = req.medley.views + 1;
        req.medley.save(function(err, medley) {
            if (req.user) {
                add_voted_attribute(req, req.medley, function(medley){
                    res.jsonp(medley);
                });
            } else {
                res.jsonp(medley);
            }
        });
    };

    // Update Vote Count
    exports.updateVoteCount = function(req, res) {
        Vote.find({ medley: req.medley, user: req.user }).exec(function(err, vote) {
            if (err) {
                console.log(err);
                res.jsonp({ error: "Something went wrong with your vote"});
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
                            req.medley.save(function(err, medley) {
                                add_voted_attribute(req, req.medley, function(medley) {
                                    res.jsonp(medley); 
                                });
                            })
                        };
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
                            req.medley.save(function(err, medley) {
                                add_voted_attribute(req, req.medley, function(medley) {
                                    res.jsonp(medley);
                                });
                            })
                        };
                    });
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
        if (req.user) {
            add_voted_attribute(req, req.medley, function(medley){
                res.jsonp(medley);
            });
        } else {
            res.jsonp(req.medley);
        };
    };

    // Find Medley by Username
    exports.getUserMedleys = function(req, res) {
        Medley.find({ user: req.params.userId }).sort({ votes: -1 }).limit(10).populate('user', 'name username').exec(function(err, medleys) {
                if (req.user) {
                    // Event Listener
                    eventEmitter.on('userMedleys', function(medleys)  {
                        eventEmitter.removeAllListeners('userMedleys');
                        medleys.sort(function(obj1, obj2) {
                            return obj2.votes - obj1.votes;
                        });
                        res.jsonp(medleys);
                    });
                    // Add Voted Attribute
                    var medleys_with_voted_attribute = [];
                    medleys.forEach(function(m){
                        add_voted_attribute(req.user, m, function(medley) {
                            medleys_with_voted_attribute.push(medley);
                            if (medleys_with_voted_attribute.length == medleys.length) { 
                                eventEmitter.emit('userMedleys', medleys_with_voted_attribute); 
                            };
                        });
                    })
                } else {
                    res.jsonp(medleys);
                };
        });
    }; // getUserMedleys

    // Find Medleys by Hashtag
    exports.getByHashtag = function(req, res) {
        var hashtag = '#' + req.params.hashtag;
        Medley.find({ hashtags: hashtag }).sort({ votes: -1 }).limit(20).populate('user', 'name username').exec(function(err, medleys) {
                if (err) { 
                    console.log(err) ;
                    return false;
                } else {
                    if (req.user) {
                        var medleys_with_voted_attribute = [];
                        // Event Listener
                        eventEmitter.on('hashtagMedleys', function(medleys)  {
                            eventEmitter.removeAllListeners('hashtagMedleys');
                            medleys.sort(function(obj1, obj2) {
                                return obj2.votes - obj1.votes;
                            });
                            res.jsonp(medleys);
                        });
                        // Add Voted Attribute
                        medleys.forEach(function(m){
                            add_voted_attribute(req.user, m, function(medley) {
                                medleys_with_voted_attribute.push(medley);
                                if (medleys_with_voted_attribute.length == medleys.length) { 
                                    eventEmitter.emit('hashtagMedleys', medleys_with_voted_attribute); 
                                };
                            });
                        })
                    } else {
                        res.jsonp(medleys);
                    }; // if user logged in
                }; // if err
        }); // Medley.find
    }; // getByHashtag

    // Show Most Voted Medleys
    exports.most_voted = function(req, res) {
            Medley.find().sort({votes: -1}).limit(10).populate('user', 'name username').exec(function(err, medleys) {
                if (err) { 
                    console.log(err) ;
                    return false;
                } else {
                    if (req.user) {
                        // Event Listener
                        eventEmitter.on('mostVoted', function(medleys)  {
                            eventEmitter.removeAllListeners('mostVoted');
                            medleys.sort(function(obj1, obj2) {
                                return obj2.votes - obj1.votes;
                            });
                            res.jsonp(medleys);
                        }); 
                        // Add Voted Attribute
                        var medleys_with_voted_attribute = [];
                        medleys.forEach(function(m){
                            add_voted_attribute(req.user, m, function(medley){
                                medleys_with_voted_attribute.push(medley);
                                if (medleys_with_voted_attribute.length == medleys.length) { 
                                    eventEmitter.emit('mostVoted', medleys_with_voted_attribute); 
                                };
                            });
                        });
                    } else {
                        res.jsonp(medleys);
                    }; // if user logged in
                }; // if err
            });
    }; // most_voted

    // Show Most Viewed Medleys
    exports.most_viewed = function(req, res) {
           Medley.find().sort({views: -1}).limit(10).populate('user', 'name username').exec(function(err, medleys) {
                if (err) { 
                    console.log(err) ;
                    return false;
                } else {
                    if (req.user) {
                        // Event Listener
                        eventEmitter.on('mostViewed', function(medleys) {
                            eventEmitter.removeAllListeners('mostViewed');
                            medleys.sort(function(obj1, obj2) {
                                return obj2.views - obj1.views;
                            });
                            res.jsonp(medleys);
                        });
                        // Add Voted Attribute
                        var medleys_with_voted_attribute = [];
                        medleys.forEach(function(m){
                            add_voted_attribute(req.user, m, function(medley){
                                medleys_with_voted_attribute.push(medley);
                                if (medleys_with_voted_attribute.length == medleys.length) { 
                                    eventEmitter.emit('mostViewed', medleys_with_voted_attribute); 
                                };
                            });
                        });
                    } else {
                        res.jsonp(medleys);
                    }; // if user logged in
                }; // if err
            });
    }; // most_viewed

    // Show Most Recent Medleys
    exports.most_recent = function(req, res) {
           Medley.find().sort({created: -1}).limit(10).populate('user', 'name username').exec(function(err, medleys) {
                if (err) { 
                    console.log(err) ;
                    return false;
                } else {
                    if (req.user) {
                        // Event Listener
                        eventEmitter.on('mostRecent', function(medleys) {
                            eventEmitter.removeAllListeners('mostRecent');
                            medleys.sort(function(obj1, obj2) {
                                return obj2.created - obj1.created;
                            });
                            res.jsonp(medleys);
                        });
                        // Add Voted Attribute
                        var medleys_with_voted_attribute = [];
                        medleys.forEach(function(m){
                            add_voted_attribute(req.user, m, function(medley){
                                medleys_with_voted_attribute.push(medley);
                                if (medleys_with_voted_attribute.length == medleys.length) { 
                                    eventEmitter.emit('mostRecent', medleys_with_voted_attribute); 
                                };
                            });
                        });
                    } else {
                        res.jsonp(medleys);
                    }; // if user logged in
                }; // if err
            });
    }; // most_viewed



