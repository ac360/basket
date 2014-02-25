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
    
    // Add Voted Attribute
    add_voted_attribute = function(user, medley, callback) {
        if (user) {
// Add Voted Attribute
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

    process_and_render_medleys = function(user, res, medleys) {
        // Add Affiliate Code
        medleys.forEach(function(m, index){
            if (m.user.affilate !== 'medley01-20') {
                m.items.forEach(function(i){
                    i.link = i.link.replace("medley01-20", m.user.affiliate);    
                });
            };
        });
        // Add Voted Attribute
        if (user) {
            var processedMedleys = [];
            medleys.forEach(function(m, index){
                // Find Vote And Process
                Vote.findOne({ medley: m._id, user: user._id }).exec(function(err, vote) {
                    if (vote) {
                        m            = m.toObject();
                        m.voted      = true;
                    } else {
                        m            = m.toObject();
                        m.voted      = false;
                    };
                    processedMedleys.push(m);
                    if (index + 1 === medleys.length) {
                        // Render
                        res.jsonp(processedMedleys);  
                    };
                });
            });
        } else {
            // Render
            res.jsonp(medleys)
        };
    };

// Actions

    // Find Medley by id
    exports.medley = function(req, res, next, id) {
        Medley.find({ short_id: req.params.shortId }).populate('user', 'name username affiliate').exec(function(err, medleys) {
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
                    add_voted_attribute(req.user, medley, function(medley){
                        res.jsonp(medley);
                    });
                } else {
                    var medleys = [];
                    medleys.push(medley);
                    process_and_render_medleys(req.user, res, medleys);
                };
            }
        });
    };

    // Update View Count
    exports.updateViewCount = function(req, res) {
        req.medley.views = req.medley.views + 1;
        req.medley.save(function(err, medley) {
            if (req.user) {
                add_voted_attribute(req.user, req.medley, function(medley){
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
                                add_voted_attribute(req.user, req.medley, function(medley) {
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
                                add_voted_attribute(req.user, req.medley, function(medley) {
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
        var medley  = req.medley;
        medley.remove(function(err) {
            if (err) { return next(new Error('The Medley could not be deleted')) };
            res.jsonp(medley);
        });
    };

    // Show A Medley
    exports.show = function(req, res) {
        var medleys = [];
        medleys.push(req.medley);
        process_and_render_medleys(req.user, res, medleys);
    };

    // Find Medley by Username
    exports.getByUsername = function(req, res) {
        User.findOne({ username: req.params.username }).exec(function(err, user) {
            if (err) return next(new Error('Failed to load user' + req.params.username));
            // Find Medleys
            Medley.find({ user: user._id }).sort({ votes: -1 }).limit(20).populate('user', 'name username affiliate').exec(function(err, medleys) {
                medleys.sort(function(obj1, obj2) {
                    return obj2.votes - obj1.votes;
                });
                process_and_render_medleys(req.user, res, medleys);
            });

        });
    }; // getUserMedleys

    // Find Medleys by Hashtag
    exports.getByHashtag = function(req, res) {
        var hashtag = '#' + req.params.hashtag;
        Medley.find({ hashtags: hashtag }).sort({ votes: -1 }).limit(20).populate('user', 'name username affiliate').exec(function(err, medleys) {
                if (err) { 
                    console.log(err) ;
                    return false;
                } else {
                    medleys.sort(function(obj1, obj2) {
                        return obj2.votes - obj1.votes;
                    });
                    process_and_render_medleys(req.user, res, medleys);
                }; // if err
        }); // Medley.find
    }; // getByHashtag

    // Find Medleys by Folder
    exports.getByFolder = function(req, res) {
        // Load Folder
        Folder.findOne({ _id: req.params.folderId, user: req.user }).exec(function(err, folder) {
            if (err) { 
                console.log(err);
                res.jsonp({error: "Error Loading Folder"});
            } else  if (!folder) {
                console.log("No Folder Found");
                res.jsonp({ error: "Folder Couldn't be Found" });
            } else {
                // Get X Number of Medleys - TODO enable params here
                var medleyIDs = folder.medleys.slice(0,20);
                Medley.find( {'short_id': { $in: medleyIDs } }).populate('user', 'name username affiliate').exec(function(err, medleys) {
                    process_and_render_medleys(req.user, res, medleys);
                });
            };

        });
    }; // getByHashtag

    // Show Most Voted Medleys
    exports.getByVotes = function(req, res) {
            Medley.find().sort({votes: -1}).limit(10).populate('user', 'name username affiliate').exec(function(err, medleys) {
                if (err) { 
                    console.log(err) ;
                    return false;
                } else {
                    medleys.sort(function(obj1, obj2) {
                        return obj2.votes - obj1.votes;
                    });
                    process_and_render_medleys(req.user, res, medleys);
                }; // if err
            });
    }; // most_voted

    // Show Most Viewed Medleys
    exports.getByViews = function(req, res) {
            Medley.find().sort({views: -1}).limit(20).populate('user', 'name username affiliate').exec(function(err, medleys) {
                if (err) { 
                    console.log(err) ;
                    return false;
                } else {
                    medleys.sort(function(obj1, obj2) {
                        return obj2.views - obj1.views;
                    });
                    process_and_render_medleys(req.user, res, medleys);
                }; // if err
            });
    }; // most_viewed

    // Show Most Recent Medleys
    exports.getByDate = function(req, res) {
            Medley.find().sort({created: -1}).limit(20).populate('user', 'name username affiliate').exec(function(err, medleys) {
                if (err) { 
                    console.log(err) ;
                    return false;
                } else {
                    medleys.sort(function(obj1, obj2) {
                        return obj2.created - obj1.created;
                    });
                    process_and_render_medleys(req.user, res, medleys);
                }; // if err
            });
    }; // most_viewed

    exports.getByFeatured = function(req, res) {
        var allMedleys    = [];
        // Get By Votes
        Medley.find().sort({votes: -1}).limit(17).populate('user', 'name username affiliate').exec(function(err, medleysByVotes) {            
            // Get By Views
            Medley.find().sort({views: -1}).limit(17).populate('user', 'name username affiliate').exec(function(err, medleysByViews) {
                allMedleys = allMedleys.concat(medleysByVotes);
                allMedleys = allMedleys.concat(medleysByViews);
                // Randomize Order
                function randOrd(){
                    return (Math.round(Math.random())-0.5); 
                };
                allMedleys.sort( randOrd );
                // Strip Unique Medleys
                var finalMedleys = _.uniq(allMedleys, function (item) {
                    return item._id + item._id;
                });
                process_and_render_medleys(req.user, res, finalMedleys);
            });
        });
    };



