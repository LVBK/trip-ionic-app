angular.module('app.newTrip.controllers', ['ngMap'])
  .controller('newTripCtrl', ['$scope', '$ionicLoading', 'NgMap', '$interval', '$ionicPopup', '$state',
    '$ionicHistory', 'GoogleMapService', '$cordovaToast', 'TripService',
    function ($scope, $ionicLoading, NgMap, $interval, $ionicPopup, $state, $ionicHistory,
              GoogleMapService, $cordovaToast, TripService) {
      //TODO: check internet connection state
      $scope.vm = {
        origin_input: null,
        origin_latlng: null,
        destination_input: null,
        destination_latlng: null,
        isRoundTrip: false,
        travelTime: new Date(),
        returnTime: new Date(),
        travelOften: [
          false, false, false, false, false, false, false
        ],
        returnOften: [
          false, false, false, false, false, false, false
        ]
      };
      $scope.vm.tripType = {
        value: null
      }
      $scope.preferences = [
        {name: "One time", value: 'one-time'},
        {name: "Often", value: 'often'}
      ];
      function bonusSomeDay(inputDate, bonusDay) {
        inputDate.setDate(inputDate.getDate() + bonusDay);
        console.log(inputDate);
        return inputDate;
      };
      $scope.startDatepicker = {
        date: new Date(),
        mondayFirst: true,
        disablePastDays: true,
        showDatepicker: false,
        showTodayButton: true,
        calendarMode: false,
        hideCancelButton: false,
        hideSetButton: true,
        callback: function (value) {
          if ($scope.vm.tripType.value == "often") {
            $scope.endDatepicker.startDate = value;
            $scope.endDatepicker.endDate = bonusSomeDay(value, 10);
          }
        }
      };
      $scope.endDatepicker = {
        date: bonusSomeDay(new Date(), 10),
        mondayFirst: true,
        startDate: $scope.startDatepicker.date,
        endDate: bonusSomeDay(new Date(), 10),
        disablePastDays: true,
        showDatepicker: false,
        showTodayButton: true,
        calendarMode: false,
        hideCancelButton: false,
        hideSetButton: true,
        callback: function (value) {
        }
      };
      $scope.travelDatepicker = {
        date: new Date(),
        mondayFirst: true,
        disablePastDays: true,
        showDatepicker: false,
        showTodayButton: true,
        calendarMode: false,
        hideCancelButton: false,
        hideSetButton: true,
        callback: function (value) {
          $scope.returnDatepicker.startDate = value;
        }
      };
      $scope.returnDatepicker = {
        date: new Date(),
        mondayFirst: true,
        startDate: function () {
          return $scope.travelDatepicker.date;
        },
        disablePastDays: true,
        showDatepicker: false,
        showTodayButton: true,
        calendarMode: false,
        hideCancelButton: false,
        hideSetButton: true,
        callback: function (value) {
          // your code
        }
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
        var tripDateTime;
        console.log($scope.vm.isRoundTrip, $scope.vm.tripType.value);
        if ($scope.vm.isRoundTrip == true && $scope.vm.tripType.value == 'often') {
          tripDateTime = {
            isRoundTrip: $scope.vm.isRoundTrip,
            tripType: $scope.vm.tripType.value,
            startDate: $scope.startDatepicker.date,
            endDate: $scope.endDatepicker.date,
            travelOften: $scope.vm.travelOften,
            travelTime: $scope.vm.travelTime,
            returnOften: $scope.vm.returnOften,
            returnTime: $scope.vm.returnTime
          }
        } else if ($scope.vm.isRoundTrip == false && $scope.vm.tripType.value == 'often') {
          tripDateTime = {
            isRoundTrip: $scope.vm.isRoundTrip,
            tripType: $scope.vm.tripType.value,
            startDate: $scope.startDatepicker.date,
            endDate: $scope.endDatepicker.date,
            travelOften: $scope.vm.travelOften,
            travelTime: $scope.vm.travelTime,
          }
        } else if ($scope.vm.isRoundTrip == true && $scope.vm.tripType.value == 'one-time') {
          tripDateTime = {
            isRoundTrip: $scope.vm.isRoundTrip,
            tripType: $scope.vm.tripType.value,
            travelDate: $scope.travelDatepicker.date,
            returnDate: $scope.returnDatepicker.date,
            travelTime: $scope.vm.travelTime,
            returnTime: $scope.vm.returnTime
          }
        } else if ($scope.vm.isRoundTrip == false && $scope.vm.tripType.value == 'one-time') {
          tripDateTime = {
            isRoundTrip: $scope.vm.isRoundTrip,
            tripType: $scope.vm.tripType.value,
            travelDate: $scope.travelDatepicker.date,
            travelTime: $scope.vm.travelTime,
          }
        } else {
          console.log("hahahaha");
          $ionicLoading.hide();
          $scope.showAlert("Please complete all information");
        }
        TripService.createATrip(origin, destination, tripDateTime, function (err, result) {
          $ionicLoading.hide();
          if (err) {
            $scope.showAlert(err);
          } else {
            $scope.showAlert("Create trip success");
          }
        })
      };
    }])
