angular.module('app.myReservations.controllers', [])

  .controller('myReservationsCtrl', ['$scope', 'BookService', '$ionicPopup', '$ionicLoading',
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
        $scope.stateOptions = [
          {name: "All", value: null},
          {name: "Waiting", value: 'waiting'},
          {name: "Accepted", value: 'accepted'},
          {name: "Canceled", value: 'canceled'},
          {name: "Denied", value: 'denied'},];
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
          filterState: $scope.stateOptions[1].value
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
        $scope.filterStateChanged = function(){
          $scope.searchData.noMoreItemAvailable = false;
        }
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
        };
        //$scope.getRoadMap = function(roadMapId){
        //  return RoadMaps.findOne(roadMapId);
        //};
        //$scope.bookCancel = function(reservationId){
        //  BookService.bookCancel(reservationId, function(err, result){
        //    if(err){
        //      $scope.showAlert(err);
        //    } else {
        //      $scope.showAlert(result);
        //    }
        //  });
        //}
      }
    ]
  )
