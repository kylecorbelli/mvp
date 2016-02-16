var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var scrape = require('../helpers/scrape-utilities');
var dbUtil = require('../helpers/db-utilities');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

// Routes:
app.get('/', function(req, res) {
  res.render('index', { title: 'Province' });
});

app.post('/city', function(req, res) {
  console.log('post request with req.body:');
  console.log(req.body);
  var cityNameInputText = req.body.cityNameText;
  scrape.getUniqueCityName(cityNameInputText, function(uniqueCityName) {
    dbUtil.isInDatabase(uniqueCityName, function(found) {
      if (found) {
        dbUtil.fetchCity(uniqueCityName, function(city) {
          res.json(city);
        });
      } else {
        scrape.createNewCity(cityNameInputText, function(city) {
          console.log('should be done');
          dbUtil.insertCity(city, function() {
            res.json(city);
          });
        });
      }
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(8080, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('Listening on port ', 8080);
  }
});

module.exports = app;
