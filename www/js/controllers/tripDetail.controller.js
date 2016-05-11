angular.module('app.tripDetail.controllers', [])

  .controller('tripDetailCtrl', ['$scope', 'TripService', '$ionicPopup', 'GoogleMapService', '$ionicLoading',
      '$stateParams', 'GeneralService', '$ionicModal', 'BookService', '$ionicHistory', '$state', '$timeout', 'CommentService',
      function ($scope, TripService, $ionicPopup, GoogleMapService, $ionicLoading,
                $stateParams, GeneralService, $ionicModal, BookService, $ionicHistory, $state, $timeout, CommentService) {
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
        $ionicLoading.show();
        $scope.data = {
          tripId: $stateParams.tripId,
          comments: [],
          limit: 5,
          rowCount: 0,
          noMoreItemAvailable: false,
          trip: null,
          user: null,
          emptySeats: null,
          bookSeats: null,
          isFull: false,
          callback: function (err, result) {
            console.log("Err", err, "Result", result);
            $ionicLoading.hide();
          },
          commentText: null
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
            if ($scope.getReactively('data.trip.seats') && $scope.getReactively('data.trip.slots')) {
              var emptySeats = $scope.data.trip.seats - $scope.data.trip.slots.length;
              $scope.isFull = (emptySeats == 0);
              $scope.bookOption = $scope.bookingOptions[emptySeats];
              return emptySeats;
            }
          },
          isDeparted: function () {
            if ($scope.getReactively('data.trip.startAt')) {
              if ($scope.data.trip.startAt < new Date()) {
                return true;
              }
            }
          },
          tripDeleted: function () {
            return $scope.getReactively('data.trip.isDeleted');
          },
          driverDeleted: function () {
            return $scope.getReactively('data.user.isDeleted');
          },
          currentUser: function () {
            return Meteor.user();
          },
          noItemAvailable: function () {
            if ($scope.getReactively('data.comments')) {
              if ($scope.data.comments.length > 0) {
                return false
              }
            }
            return true;
          }
        });
        $scope.getThumbnailUrl = function (imageId) {
          return GeneralService.getThumbnailUrl(imageId);
        };
        TripService.tripDetailSubscribe($scope.data, $scope);
        $ionicModal.fromTemplateUrl('./../../templates/bookSeat.html', {
          scope: $scope,
          animation: 'slide-in-up',
        }).then(function (modal) {
          $scope.modal = modal;
        });

        $scope.openModal = function () {
          $scope.modal.show();
        };

        $scope.closeModal = function () {
          $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
          $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
          // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
          // Execute action
        });
        $scope.book = function (tripId, totalSeats) {
          $ionicLoading.show();
          BookService.bookSeats(tripId, totalSeats, function (err, result) {
            $ionicLoading.hide();
            if (err) {
              $scope.showAlert(err.reason);
            } else {
              $scope.closeModal();
              $scope.showAlert("Booking successful! Please wait driver approve it!");
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $state.go('menu.myReservationDetail', {reservationId: result});
            }
          });
        }
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
        };
        $scope.loadMore = function () {
          var remain = $scope.data.rowCount - $scope.data.limit;
          if (remain > 5) {
            $scope.data.limit += 5;
          } else if (remain > 0) {
            $scope.data.limit += remain;
          } else {
            $scope.data.noMoreItemAvailable = true;
          }
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, 200);
        };
        $scope.comment = function (tripId, receiveUserId, content) {
          $ionicLoading.show();
          CommentService.comment(tripId, receiveUserId, content, function (err, result) {
            $ionicLoading.hide();
            if (err) {
              $scope.showAlert(err.reason);
            } else {
              $scope.showAlert("Comment Successful!");
            }
          });
        };
        CommentService.commentsSubscribe($scope.data, $scope);
      }
    ]
  )
