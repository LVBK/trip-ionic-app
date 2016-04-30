angular.module('app.reservationDetail.controllers', [])

  .controller('reservationDetailCtrl', ['$scope', '$ionicPopup', '$ionicLoading',
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
          booker: null
        };
        $scope.getThumbnailUrl = function (imageId) {
          return GeneralService.getThumbnailUrl(imageId);
        };
        $scope.bookAccept = function(reservationId){
          $ionicLoading.show();
          BookService.bookAccept(reservationId, function(err, result){
            console.log(err, result);
            $ionicLoading.hide();
            if(err){
              $scope.showAlert({arg1: err.reason});
            } else {
              $scope.showAlert({arg1: result});
            }
          })
        };
        $scope.bookDeny = function(reservationId){
          $ionicLoading.show();
          BookService.bookDeny(reservationId, function(err, result){
            console.log(err, result);
            $ionicLoading.hide();
            if(err){
              $scope.showAlert({arg1: err.reason});
            } else {
              $scope.showAlert({arg1: result});
            }
          })
        }
        BookService.reservationDetailSubscribe($scope.vm, $scope);
      }
    ]
  )
