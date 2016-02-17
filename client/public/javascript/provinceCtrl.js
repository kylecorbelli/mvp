angular.module('province.ctrl', [])
  .controller('provinceCtrl', function($scope, Cities) {
    $scope.showLoading = false;
    $scope.findCities = function() {
      $scope.showLoading = true;
      $scope.cityData1 = false;
      $scope.cityData2 = false;
      Cities.findCity($scope.citySearch1)
        .then(function(res) {
          $scope.cityData1 = res.data;
          console.log('in ctrl, res.data: ', res.data);
        });
      Cities.findCity($scope.citySearch2)
        .then(function(res) {
          $scope.cityData2 = res.data;
          console.log('in ctrl, res.data: ', res.data);
        });
    };
  });
  