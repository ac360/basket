/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


/**
 * City Schema
 */
var CitySchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    ascii_name: {
        type: String,
        default: '',
        trim: true
    },
    country_code: {
        type: String,
        default: '',
        trim: true
    },
    county_code: {
        type: String,
        default: '',
        trim: true
    },
    latitude: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    longitude: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    population: {
        type: String,
        default: '',
        trim: true
    },
    elevation: {
        type: String,
        default: '',
        trim: true
    },
    time_zone: {
        type: String,
        default: '',
        trim: true
    }
});

// Statics
CitySchema.statics = {
    load: function(name, cb) {
        this.findOne({
            name: name
        }).exec(cb);
    }
};

mongoose.model('City', CitySchema);