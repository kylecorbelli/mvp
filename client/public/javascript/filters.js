angular.module('province.filters', [])
  .filter('percentage', function() {
    return function(input, decimals) {
      return (input * 100).toFixed(decimals) + '%';
    };
  });