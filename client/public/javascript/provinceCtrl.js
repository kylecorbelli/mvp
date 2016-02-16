angular.module('province.ctrl', [])
  .controller('provinceCtrl', function($scope, Cities) {
    $scope.findCity = function() {
      Cities.findCity($scope.citySearch)
        .then(function(res) {
          console.log('in ctrl, res.data: ', res.data);
        });
    };
  });
  