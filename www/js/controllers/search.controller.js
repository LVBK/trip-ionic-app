angular.module('app.search.controllers', [])

  .controller('searchCtrl', ['$scope', 'TripService', '$ionicPopup', 'GoogleMapService', '$ionicLoading', '$stateParams'
    , function ($scope, TripService, $ionicPopup, GoogleMapService, $ionicLoading, $stateParams) {
      console.log($stateParams);
      $scope.distanceOptions = [
        {name: "5 kilometers", value: 5000},
        {name: "10 kilometers", value: 10000},
        {name: "15 kilometers", value: 15000},
        {name: "30 kilometers", value: 30000},
        {name: "60 kilometers", value: 60000},
      ];
      $scope.vm = {
        distance: $scope.distanceOptions[0].value,
        origin_input: $stateParams.originSearch,
        origin_latlng: $stateParams.origin_latlng,
        destination_input: $stateParams.destinationSearch,
        destination_latlng: $stateParams.destination_latlng
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
        distance: $scope.vm.distance,
        origin_latlng: $scope.vm.origin_latlng,
        destination_latlng: $scope.vm.destination_latlng,
        date: $scope.searchDatepicker.date,
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

      $scope.search = function (origin_latlng, destination_latlng, distance, date) {
        console.log(origin_latlng, destination_latlng, distance, date);
        $scope.searchData.distance = distance;
        $scope.searchData.origin_latlng = origin_latlng;
        $scope.searchData.destination_latlng = destination_latlng;
        $scope.searchData.date = date;
      };
      TripService.tripSearchSubscribe($scope.searchData, $scope);
    }])

