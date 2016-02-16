var City = require('../server/db-models/cityModel');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/province');
var db = mongoose.connection;

module.exports.isInDatabase = function(cityName, callback) {
  City.findOne({name: cityName}, function(err, city) {
    if (err) {
      console.error(err);
    }
    if (city) {
      callback(true);
    } else {
      callback(false);
    }
    db.close();
  });
};

module.exports.fetchCity = function(cityName, callback) {
  City.findOne({name: cityName}, function(err, city) {
    if (err) {
      console.error(err);
    }
    if (city) {
      callback(city);
    }
    db.close();
  });
};

// isInDatabase(process.argv[2]);