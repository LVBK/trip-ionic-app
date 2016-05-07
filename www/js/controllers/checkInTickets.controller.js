angular.module('app.checkInTickets.controllers', [])

  .controller('checkInTicketsCtrl', ['$scope', 'CheckInService', '$ionicPopup', '$ionicLoading', '$timeout',
      function ($scope, CheckInService, $ionicPopup, $ionicLoading, $timeout) {
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
        $scope.stateOptions = [
          {name: "All", value: null},
          {name: "Coming", value: 'coming'},
          {name: "CheckInAble", value: 'checkInAble'},
          {name: "CheckedIn", value: 'checkedIn'},
          {name: "CheckedOut", value: 'checkedOut'},
          {name: "Expired", value: 'expired'},
        ];
        $scope.searchData = {
          limit: 5,
          rowCount: 0,
          date: new Date(),
          tickets: [],
          noMoreItemAvailable: false,
          filterState: $scope.stateOptions[2].value
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
            $scope.searchData.date = value;
          }
        };
        $scope.filterStateChanged = function () {
          $scope.searchData.noMoreItemAvailable = false;
        };
        $scope.helpers({
          isLoggedIn: function () {
            return Meteor.userId() !== null;
          },
          noItemAvailable: function () {
            if ($scope.getReactively('searchData.tickets')) {
              if ($scope.searchData.tickets.length > 0) {
                return false
              }
            }
            return true;
          }
        });
        CheckInService.checkInTicketsSubscribe($scope.searchData, $scope);

        $scope.moreDataCanBeLoad = function () {
          return true;
        }
        $scope.loadMore = function () {
          var remain = $scope.searchData.rowCount - $scope.searchData.limit;
          if (remain > 5) {
            $scope.searchData.limit += 5;
          } else if (remain > 0) {
            $scope.searchData.limit += remain;
          } else {
            $scope.searchData.noMoreItemAvailable = true;
          }
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, 200);
        };
        $scope.getTrip = function(tripId){
          return Trips.findOne(tripId);
        };
      }
    ]
  )
