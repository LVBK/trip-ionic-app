angular.module('app.checkInTicket.controllers', [])

  .controller('checkInTicketCtrl', ['$scope', 'CheckInService', '$ionicPopup', '$ionicLoading', '$stateParams', '$q',
      function ($scope, CheckInService, $ionicPopup, $ionicLoading, $stateParams, $q) {
        $scope.checkOutLimitTimeOptions = [
          {name: "10 minutes", value: 10},
          {name: "30 minutes", value: 30},
          {name: "1 hour", value: 60},
          {name: "3 hours", value: 180},
          {name: "6 hours", value: 360},
          {name: "12 hours", value: 720},
          {name: "24 hours", value: 1440},
          {name: "36 hours", value: 2160},
          {name: "48 hours", value: 2880},
        ];
        $scope.showAlert = function (value) {
          var myPopup = $ionicPopup.alert({
            template: '',
            title: value,
            scope: $scope,
            buttons: [
              {
                text: '<b>OK</b>',
                type: 'button-positive',
              },
            ]
          });
        };
        getCurrentLocationAsync = function (callback) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
              var pos = [
                position.coords.longitude,
                position.coords.latitude
              ];
              callback(pos);
            });
          } else {
            callback(null);
          }
        }

        $scope.vm = {
          checkInTicketId: $stateParams.checkInTicketId,
          ticket: null,
          trip: null,
          checkOutPassword: null,
          checkOutLimitTime: $scope.checkOutLimitTimeOptions[0].value,
        };
        $scope.helpers({
          isLoggedIn: function () {
            return Meteor.userId() !== null;
          },
          ticketDeleted: function () {
            return $scope.getReactively('vm.ticket.isDeleted');
          },
          tripDeleted: function () {
            return $scope.getReactively('vm.trip.isDeleted');
          }
        });
        $scope.checkIn = function (ticketId, checkOutPassword, checkOutLimitMinute) {
          $ionicLoading.show();
          var currentLocation = null;
          getCurrentLocationAsync(function (coordinates) {
            if (coordinates) {
              currentLocation = {
                "type": "Point",
                "coordinates": coordinates,
              }
            }
            CheckInService.checkIn(ticketId, checkOutPassword, checkOutLimitMinute, currentLocation,
              function (err, result) {
                $ionicLoading.hide();
                if (err) {
                  $scope.showAlert(err.reason);
                } else {
                  $scope.showAlert(result);
                }
              })
          });
        };
        $scope.checkOut = function (ticketId, checkOutPassword) {
          $ionicLoading.show();
          var currentLocation = null;
          getCurrentLocationAsync(function (coordinates) {
            if (coordinates) {
              currentLocation = {
                "type": "Point",
                "coordinates": coordinates,
              }
            }
            CheckInService.checkOut(ticketId, checkOutPassword, currentLocation, function (err, result) {
              $ionicLoading.hide();
              if (err) {
                $scope.showAlert(err.reason);
              } else {
                $scope.showAlert(result);
              }
            })
          });
        };
        CheckInService.checkInTicketDetailSubscribe($scope.vm, $scope);
      }
    ]
  )

