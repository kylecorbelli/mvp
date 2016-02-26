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
        });
      Cities.findCity($scope.citySearch2)
        .then(function(res) {
          $scope.cityData2 = res.data;
        });
    };
    $scope.hideBigLogo = function() {
      $scope.bigLogoHidden = true;
    };
    $scope.showBigLogo = function() {
      $scope.bigLogoHidden = false;
    };
  });
