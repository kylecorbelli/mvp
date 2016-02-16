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

var getSperlingHousingStats = function(cityInputText, cityObj, done) {
  var cityUrl = cityUrlEncode(cityInputText, 'sperlingHousing');
  request.get(cityUrl, function(err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var $ = cheerio.load(body);
      var percentOwnerOccs = $('#mainContent_dgHousing')
        .find('tr:nth-child(8)')
        .find('td:nth-child(2)')
        .text()
        .replace('%', '');
      percentOwnerOccs = parseFloat(percentOwnerOccs);

      var percentRenters = $('#mainContent_dgHousing')
        .find('tr:nth-child(10)')
        .find('td:nth-child(2)')
        .text()
        .replace('%', '');
      percentRenters = parseFloat(percentRenters);

      var totalOccupied = (percentOwnerOccs + percentRenters);
      cityObj.percentRenters = percentRenters / totalOccupied;
      cityObj.percentOwnerOccs = percentOwnerOccs / totalOccupied;

      var propertyTaxRate = $('#mainContent_dgHousing')
        .find('tr:nth-child(7)')
        .find('td:nth-child(2)')
        .text()
        .replace('$', '');
      cityObj.propertyTaxRate = parseFloat(propertyTaxRate) / 1000;

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

      // City Name
      var cityName = $('h1.city')
        .find('span')
        .text()
        .trim();
      cityObj.name = cityName;

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

      var usAveCrime = $('#crime')
        .find('tfoot')
        .find('td')
        .first()
        .text()
        .split('=')[1]
        .trim()
        .replace(')', '');
      usAveCrime = parseFloat(usAveCrime);

      var crimeRating = $('#crime')
        .find('tfoot')
        .find('td')
        .last()
        .text()
        .trim();
      cityObj.crimeRating = (parseFloat(crimeRating) / usAveCrime).toFixed(2);
      done();
    }
  });
};

var getIndeedStats = function(cityInputText, cityObj, done) {
  var cityUrl = cityUrlEncode(cityInputText, 'indeed');
  request.get(cityUrl, function(err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var $ = cheerio.load(body);
      var jsDevSalary = $('#salary_display_table')
        .find('tbody')
        .find('tr')
        .first()
        .find('td:nth-child(2)')
        .find('span')
        .text()
        .trim()
        .replace('$', '')
        .replace(',', '');
      cityObj.jsDevSalary = parseInt(jsDevSalary);
      done();
    }
  });
};

var getTruliaStats = function(cityInputText, cityObj, done) {
  var cityUrl = cityUrlEncode(cityInputText, 'trulia');
  request.get(cityUrl, function(err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var $ = cheerio.load(body);
      var medianHomePrice = $('#locationPriceModule')
        .find('div')
        .first()
        .find('p')
        .first()
        .text()
        .replace('$', '')
        .replace(',', '')
        .trim();
      cityObj.medianHomePrice = parseInt(medianHomePrice);

      var medianRent = $('#locationPriceModule')
        .find('div:nth-child(3)')
        .find('p')
        .first()
        .text()
        .replace('$', '')
        .replace(',', '')
        .trim();
      cityObj.medianRent = parseInt(medianRent);
      done();
    }
  });
};

var getMortgageStats = function(cityInputText, cityObj, done) {
  var cityUrl = 'http://www.bankrate.com/finance/mortgages/current-interest-rates.aspx';
  request.get(cityUrl, function(err, res, body) {
    if (err) {
      console.erro(err);
    } else {
      var $ = cheerio.load(body);
      var thirtyYearMortgageRate = $('.rate_averages_mod')
        .find('tr.rate_change_up')
        .first()
        .find('td.rate')
        .find('a')
        .text()
        .trim()
        .replace('%', '');
      cityObj.thirtyYearMortgageRate = parseFloat(thirtyYearMortgageRate) / 100;
      done();
    }
  });
};

var getWikiPhoto = function(cityInputText, cityObj, done) {
  var cityUrl = cityUrlEncode(cityInputText, 'wikipedia');
  request.get(cityUrl, function(err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var $ = cheerio.load(body);
      var cityPhoto = $('img')
        .first()
        .attr('src')
        .trim();
      cityObj.imageUrl = cityPhoto;
      done();
    }
  });
};

// getWikiPhoto(process.argv[2], new City(), function(){});

var createNewCity = function(cityInputText) {
  var newCity = new City();
  newCity.name = cityInputText;
  async.parallel([
    function(cb) {
      getSperlingStats(cityInputText, newCity, cb);
    },
    function(cb) {
      getSperlingHousingStats(cityInputText, newCity, cb);
    },
    function(cb) {
      getCityDataStats(cityInputText, newCity, cb);
    },
    function(cb) {
      getIndeedStats(cityInputText, newCity, cb);
    },
    function(cb) {
      getTruliaStats(cityInputText, newCity, cb);
    },
    function(cb) {
      getMortgageStats(cityInputText, newCity, cb);
    },
    function(cb) {
      getWikiPhoto(cityInputText, newCity, cb);
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
    // will then be of form ['san', 'diego', 'ca']
  var sourceSpecificFn = {
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
    },
    sperlingHousing: function(cityArr) {
      return sourceSpecificFn.sperling(cityArr).replace('climate', 'housing');
    },
    indeed: function(cityArr) {
      var modifiedCityString = cityArr
        .join('+');
      return 'http://www.indeed.com/salary?q1=JavaScript&l1=' + modifiedCityString + '&tm=1';
    },
    trulia: function(cityArr) {
      cityArr[cityArr.length - 1] = states[cityArr[cityArr.length - 1]];
      for (var i = 0; i < cityArr.length; i++) {
        cityArr[i] = cityArr[i][0].toUpperCase() + cityArr[i].slice(1);
      }
      var modifiedCityString = cityArr
        .slice(0, (cityArr.length - 1))
        .join('_');
      return 'http://www.trulia.com/real_estate/' + modifiedCityString + '-' + cityArr[cityArr.length - 1] + '/';
    },
    wikipedia: function(cityArr) {
      cityArr[cityArr.length - 1] = states[cityArr[cityArr.length - 1]];
      for (var i = 0; i < cityArr.length; i++) {
        cityArr[i] = cityArr[i][0].toUpperCase() + cityArr[i].slice(1);
      }
      var modifiedCityString = cityArr
        .slice(0, (cityArr.length - 1))
        .join('_');
      return 'https://en.wikipedia.org/wiki/' + modifiedCityString + ',_' + cityArr[cityArr.length - 1];
    }
  };
  return sourceSpecificFn[dataSource](cityArr);
}

// console.log(cityUrlEncode(process.argv[2], 'wikipedia'));