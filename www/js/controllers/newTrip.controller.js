angular.module('app.newTrip.controllers', ['ngMap'])

  .controller('newTripCtrl', ['$scope', '$ionicLoading', 'NgMap', '$interval', '$ionicPopup', '$state',
    '$ionicHistory', 'GoogleMapService', '$cordovaToast', 'TripService',
    function ($scope, $ionicLoading, NgMap, $interval, $ionicPopup, $state, $ionicHistory,
              GoogleMapService, $cordovaToast, TripService) {
      $scope.vm = {
        origin_input: null,
        origin_latlng: null,
        destination_input: null,
        destination_latlng: null
      };

      $ionicLoading.show();
      NgMap.getMap().then(function (map) {
        $scope.vm.map = map;
        $ionicLoading.hide();
      });
      $scope.vm.geocoder = new google.maps.Geocoder();

      $scope.origin_changed = function () {
        $scope.getLatLng($scope.vm.geocoder, $scope.vm.map, $scope.vm.origin_input, function (result) {
          $scope.vm.origin_latlng = result;
        })
      };
      $scope.destination_changed = function () {
        $scope.getLatLng($scope.vm.geocoder, $scope.vm.map, $scope.vm.destination_input, function (result) {
          $scope.vm.destination_latlng = result;
        })
      };
      $scope.getLatLng = function (geocoder, map, address, callback) {
        if (address) {
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
      $scope.cancel = function () {
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        if ($ionicHistory.viewHistory().backView) {
          $ionicHistory.goBack();
        } else {
          $state.go('menu.home');
        }
      }
      $scope.submit = function () {
        $ionicLoading.show();
        console.log('Origin', $scope.vm.origin_input, $scope.vm.origin_latlng);
        console.log('Destination', $scope.vm.destination_input, $scope.vm.destination_latlng);
        if (!$scope.vm.origin_latlng) {
          $ionicLoading.hide();
          $scope.showAlert("Not found start location");
          return;
        }
        if (!$scope.vm.destination_latlng) {
          $ionicLoading.hide();
          $scope.showAlert("Not found end location");
          return;
        }

        var origin = {
          "type": "Point",
          "coordinates": $scope.vm.origin_latlng,
          "name": $scope.vm.origin_input
        };
        var destination = {
          "type": "Point",
          "coordinates": $scope.vm.destination_latlng,
          "name": $scope.vm.destination_input
        };
        TripService.createATrip(origin, destination, function (err, result) {
          $ionicLoading.hide();
          if (err) {
            $scope.showAlert(err);
          } else {
            $scope.showAlert("Create trip success");
          }
        })
      };
    }])
