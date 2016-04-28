angular.module('app.tripDetail.controllers', [])

  .controller('tripDetailCtrl', ['$scope', 'TripService', '$ionicPopup', 'GoogleMapService', '$ionicLoading',
      '$stateParams', 'GeneralService', '$ionicModal',
      function ($scope, TripService, $ionicPopup, GoogleMapService, $ionicLoading,
                $stateParams, GeneralService, $ionicModal) {
        function showAlert(value) {
          var alertPopup = $ionicPopup.alert({
            title: value,
            template: '',
          });
        };
        $ionicLoading.show();
        $scope.data = {
          roadMapId: $stateParams.roadMapId,
          limit: 5,
          rowCount: 0,
          roadMap: null,
          trip: null,
          user: null,
          emptySeats: null,
          bookSeats: null,
          isFull: false,
          callback: function(err, result){
            console.log("Err", err, "Result", result);
            $ionicLoading.hide();
          }
        };
        $scope.bookingOptions = [
          {
            name: 0,
            options: {}
          },
          {
            name: 1,
            options: [
              {name: 1}
            ]
          },
          {
            name: 2,
            options: [
              {name: 2},
              {name: 1},
            ]
          },
          {
            name: 3,
            options: [
              {name: 3},
              {name: 2},
              {name: 1},
            ]
          },
          {
            name: 4,
            options: [
              {name: 4},
              {name: 3},
              {name: 2},
              {name: 1},
            ]
          },
          {
            name: 5,
            options: [
              {name: 5},
              {name: 4},
              {name: 3},
              {name: 2},
              {name: 1},
            ]
          },
          {
            name: 6,
            options: [
              {name: 6},
              {name: 5},
              {name: 4},
              {name: 3},
              {name: 2},
              {name: 1},
            ]
          }
        ]
        $scope.helpers({
          emptySeats: function () {
            if ($scope.getReactively('data.trip.seats') && $scope.getReactively('data.roadMap.slots')) {
              var emptySeats = $scope.data.trip.seats - $scope.data.roadMap.slots.length;
              $scope.isFull = (emptySeats == 0);
              $scope.bookOption = $scope.bookingOptions[emptySeats];
              return emptySeats;
            }
          },
          isDeparted: function () {
            if ($scope.getReactively('data.roadMap.startAt')) {
              if ($scope.data.roadMap.startAt < new Date()) {
                return true;
              }
            }
          },
          isDeleted: function () {
            if (!($scope.getReactively('data.roadMap')
              && $scope.getReactively('data.trip')
              && $scope.getReactively('data.user'))) {
              return true
            } else {
              return false;
            }
          },
          isLoggedIn: function () {
            return Meteor.userId() !== null;
          },
        })
        $scope.getThumbnailUrl = function (imageId) {
          return GeneralService.getThumbnailUrl(imageId);
        };
        TripService.tripDetailSubscribe($scope.data, $scope);
        $ionicModal.fromTemplateUrl('./../../templates/bookSeat.html', {
          scope: $scope,
          animation: 'slide-in-up',
        }).then(function(modal) {
          $scope.modal = modal;
        });

        $scope.openModal = function() {
          $scope.modal.show();
        };

        $scope.closeModal = function() {
          $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
          // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
          // Execute action
        });
        $scope.book = function(roadMapId, totalSeats){
          $ionicLoading.show();
          TripService.bookSeats(roadMapId, totalSeats, function(err, result){
            $ionicLoading.hide();
            if(err){
              showAlert(err);
            } else {
              $scope.closeModal();
              showAlert("Booking successful! Please wait driver approve it!");
            }
          });
        }
      }
    ]
  )
