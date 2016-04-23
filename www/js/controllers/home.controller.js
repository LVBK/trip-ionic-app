angular.module('app.home.controllers', [])

  .controller('homeCtrl', ['$scope', 'TripService', '$ionicPopup', 'GoogleMapService', '$ionicLoading'
    , function ($scope, TripService, $ionicPopup, GoogleMapService, $ionicLoading) {
      $scope.vm = {
        origin_input: null,
        origin_latlng: null,
        destination_input: null,
        destination_latlng: null
      };
      $scope.vm.geocoder = new google.maps.Geocoder();

      $scope.origin_changed = function () {
        $scope.getLatLng($scope.vm.geocoder, null, $scope.vm.origin_input, function (result) {
          $scope.vm.origin_latlng = result;
        })
      };
      $scope.destination_changed = function () {
        $scope.getLatLng($scope.vm.geocoder, null, $scope.vm.destination_input, function (result) {
          $scope.vm.destination_latlng = result;
        })
      };
      $scope.getLatLng = function (geocoder, map, address, callback) {
        if (address && address.length > 0) {
          GoogleMapService.geocodeAddress(geocoder, map, address, function (err, result) {
            if (err) {
              callback(null);
            } else {
              callback(result);
            }
          });
        } else {
          callback(null)
        }
      };
    }])
