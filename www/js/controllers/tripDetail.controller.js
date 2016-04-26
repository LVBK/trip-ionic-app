angular.module('app.tripDetail.controllers', [])

  .controller('tripDetailCtrl', ['$scope', 'TripService', '$ionicPopup', 'GoogleMapService', '$ionicLoading',
      '$stateParams', 'GeneralService',
      function ($scope, TripService, $ionicPopup, GoogleMapService, $ionicLoading,
                $stateParams, GeneralService) {
        $scope.data = {
          roadMapId: $stateParams.roadMapId,
          limit: 5,
          rowCount: 0,
          roadMap: null,
          trip: null,
          user: null,
          emptySeats: null,
          bookSeats: null
        };
        $scope.bookingOptions = [
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
              $scope.bookOption = $scope.bookingOptions[emptySeats - 1];
              return emptySeats;
            }
          }
        })
        $scope.getThumbnailUrl = function (imageId) {
          return GeneralService.getThumbnailUrl(imageId);
        };
        TripService.tripDetailSubscribe($scope.data, $scope);
      }
    ]
  )
