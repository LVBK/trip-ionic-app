angular.module('app.checkInTicket.controllers', ['ionic.rating'])

  .controller('checkInTicketCtrl', ['$scope', 'CheckInService', '$ionicPopup', '$ionicLoading',
      '$stateParams', '$q', 'FeedbackService',
      function ($scope, CheckInService, $ionicPopup, $ionicLoading,
                $stateParams, $q, FeedbackService) {
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
          setCheckOutPassword: null,
          checkOutPassword: null,
          checkOutLimitTime: $scope.checkOutLimitTimeOptions[0].value,
          feedbackCount: 0,
          rate: 0,
          max: 5,
          feedbackContent: null
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
          },
          isDriver: function () {
            return Meteor.userId() == $scope.getReactively('vm.trip.owner');
          }
        });

        $scope.inputType = 'password';
        $scope.isShowPassword = false;

        // Hide & show password function
        $scope.hideShowPassword = function () {
          if ($scope.inputType == 'password')
            $scope.inputType = 'text';
          else
            $scope.inputType = 'password';
        };

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
        $scope.feedback = function (tripId, rate, content) {
          $ionicLoading.show();
          FeedbackService.feedback(tripId, rate, content, function (err, result) {
            $ionicLoading.hide();
            if (err) {
              $scope.showAlert(err.reason);
            } else {
              $scope.showAlert("Feedback Successful!");
            }
          })
        };
        CheckInService.checkInTicketDetailSubscribe($scope.vm, $scope);
        FeedbackService.FeedbackAlreadySubscribe($scope.vm, $scope);

      }
    ]
  )

