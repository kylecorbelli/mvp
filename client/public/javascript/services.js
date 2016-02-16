angular.module('province.services', [])
  .factory('Cities', function($http) {
    var findCity = function(cityNameText) {
      return $http({
        method: 'POST',
        url: '/city',
        data: {
          cityNameText: cityNameText
        }
      });
    };
    return {
      findCity: findCity
    };
  });

  