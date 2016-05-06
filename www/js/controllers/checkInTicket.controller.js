angular.module('app.checkInTicket.controllers', [])

  .controller('checkInTicketCtrl', ['$scope', 'CheckInService', '$ionicPopup', '$ionicLoading', '$stateParams',
      function ($scope, CheckInService, $ionicPopup, $ionicLoading, $stateParams) {
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
        $scope.vm = {
          checkInTicketId: $stateParams.checkInTicketId,
          ticket: null,
          trip: null,
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
        $scope.checkIn = function (ticketId, checkOutPassword, checkOutLimitMinute, currentLocation) {
          $ionicLoading.show();
          //var currentLocation = getCurrentLocation();
          CheckInService.checkIn(ticketId, checkOutPassword, checkOutLimitMinute, currentLocation,
            function (err, result) {
              $ionicLoading.hide();
              if (err) {
                $scope.showAlert(err.reason);
              } else {
                $scope.showAlert(result);
              }
            })
        };
        $scope.checkOut = function (ticketId, checkOutPassword, currentLocation) {
          $ionicLoading.show();
          //var currentLocation = getCurrentLocation();
          CheckInService.checkOut(ticketId, checkOutPassword, currentLocation, function (err, result) {
            $ionicLoading.hide();
            if (err) {
              $scope.showAlert(err.reason);
            } else {
              $scope.showAlert(result);
            }
          })
        };
        CheckInService.checkInTicketDetailSubscribe($scope.vm, $scope);
      }
    ]
  )

