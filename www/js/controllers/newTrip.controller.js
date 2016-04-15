angular.module('app.newTrip.controllers', ['ngMap'])

  .controller('newTripCtrl', ['$scope', '$ionicLoading', 'NgMap', '$interval', '$ionicPopup', '$state',
    '$ionicHistory', 'GoogleMapService', '$cordovaToast',
    function ($scope, $ionicLoading, NgMap, $interval, $ionicPopup, $state, $ionicHistory, GoogleMapService, $cordovaToast) {
      $scope.origin_input = null;
      $scope.origin_latlng = null;
      $scope.destination_input = null;
      $scope.destination_latlng = null;
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
            GoogleMapService.geocodeAddress($scope.geocoder, $scope.map, $scope.origin_input, function (err, result) {
              if (err) {
                if(window.plugins){
                  window.plugins.toast.show(err, "short", "bottom");
                } else {
                  $scope.showAlert(err);
                }
              } else {
                console.log(result);
                $scope.origin_latlng = result;
              }
            });
          } else {
            $scope.origin_latlng = null;
          }
        },
        destination_autocomplete: function () {
          if ($scope.getReactively('destination_input')) {
            GoogleMapService.geocodeAddress($scope.geocoder, $scope.map, $scope.destination_input, function (err, result) {
              if (err) {
                if(window.plugins){
                  window.plugins.toast.show(err, "short", "bottom");
                } else {
                  $scope.showAlert(err);
                }
              } else {
                console.log(result);
                $scope.destination_latlng = result;
              }
            });
          } else {
            $scope.destination_latlng = null;
          }
        }
      });
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
      $scope.submit = function(){
        if(!$scope.origin_latlng){
          $scope.showAlert("Please choose start location");
          return;
        }
        if(!$scope.destination_latlng){
          $scope.showAlert("Please choose end location");
          return;
        }
        console.log('Origin', $scope.origin_input, $scope.origin_latlng);
        console.log('Destination', $scope.destination_input, $scope.destination_latlng);
      }
    }])
