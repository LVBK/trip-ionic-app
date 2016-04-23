angular.module('app.search.controllers', [])

  .controller('searchCtrl', ['$scope', 'TripService', '$ionicPopup', 'GoogleMapService', '$ionicLoading', '$stateParams'
    , function ($scope, TripService, $ionicPopup, GoogleMapService, $ionicLoading, $stateParams) {
      console.log($stateParams);
      $scope.vm = {
        distance: 5000,
        origin_input: $stateParams.originSearch,
        origin_latlng: null,
        destination_input: $stateParams.destinationSearch,
        destination_latlng: null
      };
      $scope.searchDatepicker = {
        date: new Date(),
        mondayFirst: true,
        disablePastDays: true,
        showDatepicker: false,
        showTodayButton: true,
        calendarMode: false,
        hideCancelButton: false,
        hideSetButton: true,
        callback: function (value) {
        }
      };
      $scope.searchData = {
        distance: 5000,
        origin_latlng: null,
        estination_latlng: null,
        date: new Date(),
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
      $scope.search = function (origin_latlng, destination_latlng, distance, date) {
        console.log(origin_latlng, destination_latlng);
        $scope.searchData.distance = distance;
        $scope.searchData.origin_latlng = origin_latlng;
        $scope.searchData.destination_latlng = destination_latlng;
        $scope.searchData.date = date;
      };
      TripService.tripSearchSubscribe($scope.searchData, $scope);
    }])

