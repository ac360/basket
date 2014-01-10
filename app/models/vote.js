// Module dependencies
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


// Vote Schema
var VoteSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    issue: {
        type: Schema.ObjectId,
        ref: 'Issue'
    }
});

// Statics
VoteSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('user', 'name username').exec(cb);
    }
};

mongoose.model('Vote', VoteSchema);