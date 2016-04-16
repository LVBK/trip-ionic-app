angular.module('app.home.controllers', [])

  .controller('homeCtrl', ['$scope', 'TripService', '$ionicPopup', 'GoogleMapService', '$ionicLoading'
    , function ($scope, TripService, $ionicPopup, GoogleMapService, $ionicLoading) {
      $scope.vm = {
        distance: 5000,
        origin_input: null,
        origin_latlng: null,
        destination_input: null,
        destination_latlng: null
      };
      $scope.searchData = {
        distance: 5000,
        origin_latlng: null,
        estination_latlng: null,
        tripSearchData: []
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
              if (window.plugins) {
                window.plugins.toast.show("Not found location", "short", "bottom");
              } else {
                $scope.showAlert("Not found location");
              }
              callback(null);
            } else {
              callback(result);
            }
          });
        } else {
          callback(null)
        }
      };
      $scope.showAlert = function (value) {
        var alertPopup = $ionicPopup.alert({
          title: value,
          template: '',
        });
      };
      $scope.search = function (origin_latlng, destination_latlng, distance) {
        console.log(origin_latlng, destination_latlng );
        $scope.searchData.distance = distance;
        $scope.searchData.origin_latlng = origin_latlng;
        $scope.searchData.destination_latlng = destination_latlng;
      };
      TripService.tripSearchSubscribe($scope.searchData, $scope);
    }])
