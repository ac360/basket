// Module dependencies.
var mongoose = require('mongoose'),
    config   = require('../../config/config'),
    // Vote     = mongoose.model('Vote'),
    Schema   = mongoose.Schema;


// Medley Schema
var MedleySchema = new Schema({
    short_id: {
        type: String,
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

// Statics
MedleySchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('user', 'name username').exec(cb);
    }
};

// MedleySchema.virtual('voted').get(function () {
//   return true;
// });

// MedleySchema.set('toJSON', { virtuals: true });
mongoose.model('Medley', MedleySchema);
