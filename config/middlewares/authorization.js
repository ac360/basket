// Generic require login routing middleware
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next(new Error('Not Authorized'));
    }
    next();
};

// User authorizations routing middleware
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};

// Medley authorizations routing middleware
exports.medley = {
    hasAuthorization: function(req, res, next) {
        if (req.medley.user.id != req.user.id) {
            if (!req.user.admin || req.user.admin === false) { 
                return next(new Error('Not Authorized'));
            }
        }
        next();
    }
};

// Client authorizations routing middleware
exports.client = {
    hasAuthorization: function(req, res, next) {
        next();
    }
};