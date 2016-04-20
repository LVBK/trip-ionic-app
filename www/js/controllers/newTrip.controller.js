angular.module('app.newTrip.controllers', ['ngMap'])
  .controller('newTripCtrl', ['$scope', '$ionicLoading', 'NgMap', '$interval', '$ionicPopup', '$state',
    '$ionicHistory', 'GoogleMapService', '$cordovaToast', 'TripService',
    function ($scope, $ionicLoading, NgMap, $interval, $ionicPopup, $state, $ionicHistory,
              GoogleMapService, $cordovaToast, TripService) {
      //TODO: check internet connection state
      $scope.helpers({
        isLoggedIn: function () {
          return Meteor.userId() !== null;
        },
      })
      $ionicLoading.show();
      $scope.preferences = [
        {name: "One time", value: 'one-time'},
        {name: "Often", value: 'often'}
      ];
      $scope.baggageSizeOptions = [
        {name: "Small", value: 'Small'},
        {name: "Medium", value: 'Medium'},
        {name: "Large", value: 'Large'}
      ];
      $scope.flexibleTimeOptions = [
        {name: "On time", value: 'On time'},
        {name: "+/- 5 minutes", value: '+/- 5 minutes'},
        {name: "+/- 10 minutes", value: '+/- 10 minutes'},
        {name: "+/- 15 minutes", value: '+/- 15 minutes'},
        {name: "+/- 30 minutes", value: '+/- 30 minutes'}
      ];
      $scope.flexibleDistanceOptions = [
        {name: "Unacceptable", value: 'Unacceptable'},
        {name: "3 kilometers", value: '3 kilometers'},
        {name: "5 kilometers", value: '5 kilometers'},
        {name: "10 kilometers", value: '10 kilometers'},
        {name: "15 kilometers", value: '15 kilometers'},
      ];
      $scope.vehicleOptions = [
        {
          name: 'Car',
          expend: 0.1,
          seats: [
            {
              name: 4,
              emptySeats: [
                {name: 3},
                {name: 2},
                {name: 1},
              ]
            },
            {
              name: 5,
              emptySeats: [
                {name: 4},
                {name: 3},
                {name: 2},
                {name: 1},
              ]
            },
            {
              name: 6,
              emptySeats: [
                {name: 5},
                {name: 4},
                {name: 3},
                {name: 2},
                {name: 1},
              ]
            },
            {
              name: 7,
              emptySeats: [
                {name: 6},
                {name: 5},
                {name: 4},
                {name: 3},
                {name: 2},
                {name: 1},
              ]
            }
          ]
        },
        {
          name: 'Motor',
          expend: 0.05,
          seats: [{
            name: 2,
            emptySeats: [
              {name: 1}
            ]
          }]
        },
      ]

      $scope.vm = {
        origin_input: null,
        origin_latlng: null,
        destination_input: null,
        destination_latlng: null,
        isRoundTrip: false,
        travelTime: new Date(),
        returnTime: new Date(),
        travelDaysInWeek: [
          false, false, false, false, false, false, false
        ],
        returnDaysInWeek: [
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
        tripType: $scope.preferences[0].value,

        distance: null,
        duration: null,
        vehicle: null,
        seats: null,
        emptySeats: null,
        pricePerSeat: null,
        baggageSize: $scope.baggageSizeOptions[1].value,
        flexibleTime: $scope.flexibleTimeOptions[0].value,
        flexibleDistance: $scope.flexibleDistanceOptions[0].value,
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
            $scope.endDatepicker.endDate = bonusSomeDay(value, 30);
          }
        }
      };
      $scope.endDatepicker = {
        date: bonusSomeDay(new Date(), 30),
        mondayFirst: true,
        startDate: $scope.startDatepicker.date,
        endDate: bonusSomeDay(new Date(), 30),
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
        var tripDateTime;
        if ($scope.vm.isRoundTrip == true && $scope.vm.tripType == $scope.preferences[1].value) {
          tripDateTime = {
            isRoundTrip: $scope.vm.isRoundTrip,
            tripType: $scope.vm.tripType,
            startDate: $scope.startDatepicker.date,
            endDate: $scope.endDatepicker.date,
            travelDaysInWeek: $scope.vm.travelDaysInWeek,
            travelTime: $scope.vm.travelTime,
            returnDaysInWeek: $scope.vm.returnDaysInWeek,
            returnTime: $scope.vm.returnTime
          }
        } else if ($scope.vm.isRoundTrip == false && $scope.vm.tripType == $scope.preferences[1].value) {
          tripDateTime = {
            isRoundTrip: $scope.vm.isRoundTrip,
            tripType: $scope.vm.tripType,
            startDate: $scope.startDatepicker.date,
            endDate: $scope.endDatepicker.date,
            travelDaysInWeek: $scope.vm.travelDaysInWeek,
            travelTime: $scope.vm.travelTime,
          }
        } else if ($scope.vm.isRoundTrip == true && $scope.vm.tripType == $scope.preferences[0].value) {
          tripDateTime = {
            isRoundTrip: $scope.vm.isRoundTrip,
            tripType: $scope.vm.tripType,
            travelDate: $scope.travelDatepicker.date,
            returnDate: $scope.returnDatepicker.date,
            travelTime: $scope.vm.travelTime,
            returnTime: $scope.vm.returnTime
          }
        } else if ($scope.vm.isRoundTrip == false && $scope.vm.tripType == $scope.preferences[0].value) {
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
        var param = {
          origin: {
            "type": "Point",
            "coordinates": $scope.vm.origin_latlng,
            "name": $scope.vm.origin_input
          },
          destination: {
            "type": "Point",
            "coordinates": $scope.vm.destination_latlng,
            "name": $scope.vm.destination_input
          },
          emptySeats: $scope.vm.emptySeats.name,
          seats: $scope.vm.seats.name,
          distance: $scope.vm.distance,
          duration: $scope.vm.duration,
          pricePerSeat: $scope.vm.pricePerSeat,
          vehicle: $scope.vm.vehicle.name,
          baggageSize: $scope.vm.baggageSize,
          flexibleTime: $scope.vm.flexibleTime,
          flexibleDistance: $scope.vm.flexibleDistance
        };
        param = angular.extend(param, tripDateTime)
        TripService.createATrip(param, function (err, result) {
          $ionicLoading.hide();
          if (err) {
            showAlert(err);
          } else {
            showAlert("Create trip success");
            //TODO: a modal state go to home, got to see trip
            //TODO: reset form
          }
        })
      };
      function route() {
        if ($scope.vm.origin_input == null || $scope.vm.destination_input == null
          || $scope.vm.origin_latlng == null || $scope.vm.destination_latlng == null) {
          return;
        }
        $scope.vm.routeError = null;
        GoogleMapService.route($scope.vm.origin_input, $scope.vm.destination_input, $scope.vm.directionsService,
          function (err, result) {
            if (err) {
              $scope.vm.routeError = err;
            } else {
              $scope.vm.distance = result.routes[0].legs[0].distance;
              $scope.vm.duration = result.routes[0].legs[0].duration;
              $scope.vm.directionsDisplay.setDirections(result);
            }
          });
      }

      Math.round = (function () {
        var originalRound = Math.round;
        return function (number, precision) {
          precision = Math.abs(parseInt(precision)) || 0;
          var multiplier = Math.pow(10, precision);
          return (originalRound(number * multiplier) / multiplier);
        };
      })();
      $scope.helpers({
        'pricePerSeatCal': function () {
          if ($scope.getReactively('vm.vehicle') != null && $scope.getReactively('vm.distance') != null
            && $scope.getReactively('vm.seats') != null) {
            $scope.vm.pricePerSeat =
              Math.round($scope.vm.distance.value * $scope.vm.vehicle.expend / $scope.vm.seats.name / 1000, 3);
          }
        },
      })
    }])
