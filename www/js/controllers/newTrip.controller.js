angular.module('app.newTrip.controllers', ['ngMap'])

  .controller('newTripCtrl', ['$scope', '$ionicLoading', 'NgMap', '$interval', '$ionicPopup', '$state', '$ionicHistory',
    function ($scope, $ionicLoading, NgMap, $interval, $ionicPopup, $state, $ionicHistory) {
      $scope.origin_input = null;
      $scope.destination_input = null;
      $ionicLoading.show();
      NgMap.getMap().then(function (map) {
        $scope.map = map;
        $ionicLoading.hide();
      });
      $scope.geocoder = new google.maps.Geocoder();

      $scope.origin_changed = function (input) {
        $scope.origin_input = input;
      };
      $scope.destination_changed = function (input) {
        $scope.destination_input = input;
      };
      $scope.helpers({
        origin_autocomplete: function () {
          if ($scope.getReactively('origin_input')) {
            var latLng = $scope.geocodeAddress();
            console.log(latLng);
            return latLng;
          }
        },
        destination_autocomplete: function () {
          if ($scope.getReactively('destination_input')) {
            var latLng = $scope.geocodeAddress();
            console.log(latLng);
            return latLng;
          }
        }
      });
      $scope.geocodeAddress = function () {
        $scope.geocoder.geocode({'address': $scope.origin_input}, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            $scope.map.setCenter(results[0].geometry.location);
          } else {
            $scope.showAlert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
      $scope.showAlert = function (value) {
        var alertPopup = $ionicPopup.alert({
          title: value,
          template: '',
        });
      };
      $scope.cancel = function(){
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
    }])
