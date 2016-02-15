var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var City = require('./city-class');

var states = {
  ca: 'california',
  mi: 'michigan',
  nc: 'north-carolina',
  or: 'oregon'
};

var getSperlingStats = function(cityInputText, cityObj, done) {
  var cityUrl = cityUrlEncode(cityInputText, 'sperling');
  request.get(cityUrl, function(err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var $ = cheerio.load(body);
      var sunnyDays = $('#mainContent_dgClimate')
        .find('tr:nth-child(5)')
        .find('td:nth-child(2)')
        .text()
        .trim();
      cityObj.sunnyDays = parseInt(sunnyDays);
      done();
    }
  });
};

var getCityDataStats = function(cityInputText, cityObj, done) {
  var cityUrl = cityUrlEncode(cityInputText, 'cityData');
  request.get(cityUrl, function(err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var $ = cheerio.load(body);

      // Total population
      var totalPopulation = $('#city-population')
        .contents()[1]
        .data
        .trim()
        .split(' ')[0]
        .replace(/,/g, '');
      cityObj.totalPopulation = parseInt(totalPopulation);

      // Population density
      var populationDensity = $('#population-density')
        .find('p')
        .last()
        .contents()
        .not('b')
        .text()
        .trim()
        .replace(',', '');
      cityObj.populationDensity = parseInt(populationDensity);

      // Crime rating
      var crimeRating = $('#crime')
        .find('tfoot')
        .find('td')
        .last()
        .text()
        .trim();
      cityObj.crimeRating = parseFloat(crimeRating);
      done();
    }
  });
};

var createNewCity = function(cityInputText) {
  var newCity = new City();
  newCity.name = cityInputText;
  async.parallel([
    function(cb) {
      getSperlingStats(cityInputText, newCity, cb);
    },
    function(cb) {
      getCityDataStats(cityInputText, newCity, cb);
    }
  ], function() {
    console.log(newCity); // maybe JSON.stringify it
  });
};

createNewCity(process.argv[2]);

function cityUrlEncode(cityString, dataSource) {
  // of form 'San Diego, CA'
  var cityArr = cityString
    .trim()
    .toLowerCase()
    .replace(',', '')
    .split(' ');
  sourceSpecificFn = {
    cityData: function(cityArr) {
      var modifiedCityString = cityArr
        .slice(0, (cityArr.length - 1))
        .join('-');
      modifiedCityString += '-' + states[cityArr[cityArr.length - 1]];
      return 'http://www.city-data.com/city/' + modifiedCityString + '.html';
    },
    sperling: function(cityArr) {
      var modifiedCityString = cityArr
        .slice(0, (cityArr.length - 1))
        .join('_');
      return 'http://www.bestplaces.net/climate/city/' + states[cityArr[cityArr.length - 1]] + '/' + modifiedCityString;
    }
  };
  return sourceSpecificFn[dataSource](cityArr);
}

// console.log(cityUrlEncode(process.argv[2], 'sperling'));

