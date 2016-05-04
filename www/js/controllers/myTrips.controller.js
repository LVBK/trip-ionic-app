angular.module('app.myTrips.controllers', [])

  .controller('myTripsCtrl', ['$scope', 'TripService', '$timeout', '$ionicPopup', '$ionicLoading',
    function ($scope, TripService, $timeout, $ionicPopup, $ionicLoading) {
      function getStartDate() {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      }

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
        limit: 5,
        rowCount: 0,
        date: getStartDate(),
        trips: [],
        noMoreItemAvailable: false,
      };
      $scope.searchDatepicker = {
        date: getStartDate(),
        mondayFirst: true,
        disablePastDays: false,
        showDatepicker: false,
        showTodayButton: true,
        calendarMode: false,
        hideCancelButton: false,
        hideSetButton: true,
        callback: function (value) {
          $scope.vm.date = value;
        }
      };
      $scope.helpers({
        isLoggedIn: function () {
          return Meteor.userId() !== null;
        },
        noItemAvailable: function () {
          if ($scope.getReactively('vm.trips')) {
            if ($scope.vm.trips.length > 0) {
              return false
            }
          }
          return true;
        }
      })
      TripService.myTripsSubscribe($scope.vm, $scope);
      $scope.deleteTrip = function (tripId) {
        $ionicLoading.show();
        TripService.deleteTrip(tripId, function (err, result) {
          $ionicLoading.hide();
          if (err) {
            $scope.showAlert(err.reason);
          } else {
            $scope.showAlert("Trip deleted");
          }
        })
      }
      $scope.loadMore = function () {
        var remain = $scope.vm.rowCount - $scope.vm.limit;
        if (remain > 5) {
          $scope.vm.limit += 5;
        } else if (remain > 0) {
          $scope.vm.limit += remain;
        } else {
          $scope.vm.noMoreItemAvailable = true;
        }
        $timeout(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 200);
      };
    }])
