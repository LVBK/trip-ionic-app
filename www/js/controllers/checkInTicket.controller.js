angular.module('app.checkInTicket.controllers', [])

  .controller('checkInTicketCtrl', ['$scope', 'CheckInService', '$ionicPopup', '$ionicLoading', '$stateParams',
      function ($scope, CheckInService, $ionicPopup, $ionicLoading, $stateParams) {
        $scope.checkOutLimitTimeOptions = [
          {name: "10 minutes", value: 10},
          {name: "30 minutes", value: 30},
          {name: "1 hour", value: 60},
          {name: "3 hours", value: 180},
          {name: "6 hours", value: 360} ,
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
        function getCurrentLocation (){
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              return pos;
            });
          } else {
            return null;
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
          var currentLocation = getCurrentLocation();
          console.log(currentLocation);
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
        $scope.checkOut = function (ticketId, checkOutPassword) {
          $ionicLoading.show();
          var currentLocation = getCurrentLocation();
          console.log(currentLocation);
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

