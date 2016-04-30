angular.module('app.myReservationDetail.controllers', [])

  .controller('myReservationDetailCtrl', ['$scope', '$ionicPopup', '$ionicLoading',
      '$stateParams', 'BookService', 'GeneralService',
      function ($scope, $ionicPopup, $ionicLoading,
                $stateParams, BookService, GeneralService) {
        $scope.helpers({
          isLoggedIn: function () {
            return Meteor.userId() !== null;
          },
        });
        $scope.vm = {
          reservationId: $stateParams.reservationId,
          reservation: null,
          roadMap: null,
          driver: null
        };
        $scope.getThumbnailUrl = function (imageId) {
          return GeneralService.getThumbnailUrl(imageId);
        };
        $scope.bookCancel = function(reservationId){
          $ionicLoading.show();
          BookService.bookCancel(reservationId, function(err, result){
            //console.log(err, result);
            $ionicLoading.hide();
            if(err){
              $scope.showAlert({agr1: err});
            } else {
              $scope.showAlert({arg1: result});
            }
          })
        }
        BookService.myReservationDetailSubscribe($scope.vm, $scope);
      }
    ]
  )
