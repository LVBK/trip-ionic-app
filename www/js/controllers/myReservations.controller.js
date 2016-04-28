angular.module('app.myReservations.controllers', [])

  .controller('myReservationsCtrl', ['$scope', 'BookService', '$ionicPopup', '$ionicLoading',
      '$stateParams', '$timeout',
      function ($scope, BookService, $ionicPopup, $ionicLoading,
                $stateParams, $timeout) {
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
          noMoreItemAvailable: false
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
        BookService.reservationFromMeSubscribe($scope.searchData, $scope);

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
        }
      }
    ]
  )
