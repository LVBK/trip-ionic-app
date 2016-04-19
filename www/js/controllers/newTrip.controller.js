angular.module('app.newTrip.controllers', ['ngMap'])
  .controller('newTripCtrl', ['$scope', '$ionicLoading', 'NgMap', '$interval', '$ionicPopup', '$state',
    '$ionicHistory', 'GoogleMapService', '$cordovaToast', 'TripService',
    function ($scope, $ionicLoading, NgMap, $interval, $ionicPopup, $state, $ionicHistory,
              GoogleMapService, $cordovaToast, TripService) {
      //TODO: check internet connection state
      $ionicLoading.show();
      $scope.preferences = [
        {name: "One time", value: 'one-time'},
        {name: "Often", value: 'often'}
      ];
      $scope.vm = {
        origin_input: null,
        origin_latlng: null,
        destination_input: null,
        destination_latlng: null,
        isRoundTrip: false,
        tripType: $scope.preferences[0].value,
        travelTime: new Date(),
        returnTime: new Date(),
        travelOften: [
          false, false, false, false, false, false, false
        ],
        returnOften: [
          false, false, false, false, false, false, false
        ],
        geocoder: new google.maps.Geocoder(),
        map: new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          disableDefaultUI: true
        }),
        directionsService: new google.maps.DirectionsService,
        directionsDisplay: new google.maps.DirectionsRenderer,
        routeError: null,
      };
      $scope.vm.directionsDisplay.setMap($scope.vm.map);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          $scope.vm.map.setCenter(pos);
        });
      } else {
        $scope.vm.map.setCenter({lat: 21.3978014, lng: 105.2189301});
      }
      $ionicLoading.hide();
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
          if ($scope.vm.tripType == "often") {
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
      $scope.origin_changed = function () {
        getLatLng($scope.vm.geocoder, $scope.vm.map, $scope.vm.origin_input, function (result) {
          $scope.vm.origin_latlng = result;
          route();
        });
      };
      $scope.destination_changed = function () {
        getLatLng($scope.vm.geocoder, $scope.vm.map, $scope.vm.destination_input, function (result) {
          $scope.vm.destination_latlng = result;
          route();
        });

      };
      function getLatLng(geocoder, map, address, callback) {
        if (address) {
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
      function showAlert(value) {
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
          showAlert("Not found start location");
          return;
        }
        if (!$scope.vm.destination_latlng) {
          $ionicLoading.hide();
          showAlert("Not found end location");
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
        console.log($scope.vm.isRoundTrip, $scope.vm.tripType);
        if ($scope.vm.isRoundTrip == true && $scope.vm.tripType == 'often') {
          tripDateTime = {
            isRoundTrip: $scope.vm.isRoundTrip,
            tripType: $scope.vm.tripType,
            startDate: $scope.startDatepicker.date,
            endDate: $scope.endDatepicker.date,
            travelOften: $scope.vm.travelOften,
            travelTime: $scope.vm.travelTime,
            returnOften: $scope.vm.returnOften,
            returnTime: $scope.vm.returnTime
          }
        } else if ($scope.vm.isRoundTrip == false && $scope.vm.tripType == 'often') {
          tripDateTime = {
            isRoundTrip: $scope.vm.isRoundTrip,
            tripType: $scope.vm.tripType,
            startDate: $scope.startDatepicker.date,
            endDate: $scope.endDatepicker.date,
            travelOften: $scope.vm.travelOften,
            travelTime: $scope.vm.travelTime,
          }
        } else if ($scope.vm.isRoundTrip == true && $scope.vm.tripType == 'one-time') {
          tripDateTime = {
            isRoundTrip: $scope.vm.isRoundTrip,
            tripType: $scope.vm.tripType,
            travelDate: $scope.travelDatepicker.date,
            returnDate: $scope.returnDatepicker.date,
            travelTime: $scope.vm.travelTime,
            returnTime: $scope.vm.returnTime
          }
        } else if ($scope.vm.isRoundTrip == false && $scope.vm.tripType == 'one-time') {
          tripDateTime = {
            isRoundTrip: $scope.vm.isRoundTrip,
            tripType: $scope.vm.tripType,
            travelDate: $scope.travelDatepicker.date,
            travelTime: $scope.vm.travelTime,
          }
        } else {
          $ionicLoading.hide();
          showAlert("Please complete all information");
        }
        TripService.createATrip(origin, destination, tripDateTime, function (err, result) {
          $ionicLoading.hide();
          if (err) {
            showAlert(err);
          } else {
            showAlert("Create trip success");
          }
        })
      };
      function route() {
        if ($scope.vm.origin_input == null || $scope.vm.destination_input == null
          || $scope.vm.origin_latlng == null || $scope.vm.destination_latlng == null) {
          return;
        }
        ;
        $scope.vm.routeError = null;
        GoogleMapService.route($scope.vm.origin_input, $scope.vm.destination_input, $scope.vm.directionsService,
          function (err, result) {
            if (err) {
              $scope.vm.routeError = err;
            } else {
              $scope.vm.directionsDisplay.setDirections(result);
            }
          });
      }
    }])
