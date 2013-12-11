/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


/**
 * Issue Schema
 */
var IssueSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    location: {
        type: Object,
        required: true
    },
    google_place_name: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    google_place_formatted_address: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    google_place_id: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    google_place_reference: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
IssueSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
IssueSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('user', 'name username').exec(cb);
    }
};

mongoose.model('Issue', IssueSchema);