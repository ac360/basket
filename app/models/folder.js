// Module dependencies
var mongoose = require('mongoose'),
    config   = require('../../config/config'),
    Schema   = mongoose.Schema;


// Folder Schema
var FolderSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Folder'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    medleys: {
        type: Array
    }
});

// Statics
FolderSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('user', 'name username').exec(cb);
    }
};

mongoose.model('Folder', FolderSchema);