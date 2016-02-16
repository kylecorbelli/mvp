angular.module('province.ctrl', [])
  .controller('provinceCtrl', function($scope, Cities) {
    $scope.doThang = function() {
      console.log('did thang');
    };
  });