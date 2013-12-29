// Module dependencies.
var mongoose = require('mongoose'),
    async = require('async'),
    City = mongoose.model('City'),
    _ = require('underscore');

// Search Issues
 exports.search = function(req, res, cityName) {
    City.find({ name: new RegExp('^'+req.params.cityName, "i"), country_code: 'US' }).limit(10).exec(function(err, cities) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(cities);
        };
    });

    // City.find({ country_code: 'CA'}).exec(function(err, cities) {
    //     cities.forEach(function(city, index){
    //         city.name = city.name.toLowerCase();
    //         console.log(city.name);
    //         city.save();
    //     });
    //     console.log(cities.length);
    // });

};

// Find issue by id
// exports.city = function(req, res, next, id) {
//     City.load(name, function(err, city) {
//         if (err) return next(err);
//         if (!city) return next(new Error('Failed to load city ' + city));
//         req.city = city;
//         next();
//     });
// };