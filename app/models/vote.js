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
    medley: {
        type: Schema.ObjectId,
        ref: 'Medley'
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