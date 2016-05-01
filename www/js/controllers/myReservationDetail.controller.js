angular.module('app.myReservationDetail.controllers', [])

  .controller('myReservationDetailCtrl', ['$scope', '$ionicPopup', '$ionicLoading',
      '$stateParams', 'BookService', 'GeneralService',
      function ($scope, $ionicPopup, $ionicLoading,
                $stateParams, BookService, GeneralService) {
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
        $scope.helpers({
          isLoggedIn: function () {
            return Meteor.userId() !== null;
          },
        });
        $scope.vm = {
          reservationId: $stateParams.reservationId,
          reservation: null,
          trip: null,
          driver: null
        };
        $scope.getThumbnailUrl = function (imageId) {
          return GeneralService.getThumbnailUrl(imageId);
        };
        $scope.bookCancel = function(reservationId){
          $ionicLoading.show();
          BookService.bookCancel(reservationId, function(err, result){
            console.log(err, result);
            $ionicLoading.hide();
            if(err){
              $scope.showAlert(err.reason);
            } else {
              $scope.showAlert(result);
            }
          })
        }
        BookService.myReservationDetailSubscribe($scope.vm, $scope);
      }
    ]
  )
