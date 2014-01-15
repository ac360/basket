/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


// Medley Schema
var MedleySchema = new Schema({
    short_id: {
        type: Number,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    hashtags: {
        type: Array,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    anonymous: {
        type: Boolean,
        default: false
    },
    template: {
        type: String,
        default: 'a1',
        required: true,
        trim: true
    },
    views: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
// MedleySchema.path('title').validate(function(title) {
//     return title.length;
// }, 'Title cannot be blank');

/**
 * Statics
 */
MedleySchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('user', 'name username').exec(cb);
    }
};

mongoose.model('Medley', MedleySchema);