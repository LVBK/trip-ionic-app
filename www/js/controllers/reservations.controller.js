angular.module('app.reservations.controllers', [])

  .controller('reservationsCtrl', ['$scope', 'BookService', '$ionicPopup', '$ionicLoading',
      '$stateParams', '$timeout',
      function ($scope, BookService, $ionicPopup, $ionicLoading,
                $stateParams, $timeout) {
        $scope.showAlert = function(value) {
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
        function getStartDate() {
          var date = new Date();
          date.setHours(0, 0, 0, 0);
          return date;
        }

        $scope.searchData = {
          limit: 5,
          rowCount: 0,
          date: getStartDate(),
          reservations: [],
          noMoreItemAvailable: false,
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
        $scope.helpers({
          isLoggedIn: function () {
            return Meteor.userId() !== null;
          },
          noItemAvailable: function(){
            if($scope.getReactively('searchData.reservations')){
              if($scope.searchData.reservations.length > 0){
                return false
              }
            }
            return true;
          }
        })
        BookService.reservationToMeSubscribe($scope.searchData, $scope);
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
      }
    ]
  )
