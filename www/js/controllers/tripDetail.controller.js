angular.module('app.tripDetail.controllers', [])

  .controller('tripDetailCtrl', ['$scope', 'TripService', '$ionicPopup', 'GoogleMapService', '$ionicLoading',
      '$stateParams', 'GeneralService', '$timeout',
      function ($scope, TripService, $ionicPopup, GoogleMapService, $ionicLoading,
                $stateParams, GeneralService, $timeout) {
        $scope.data = {
          roadMapId: $stateParams.roadMapId,
          limit: 5,
          rowCount: 0,
          roadMap: null,
          trip: null,
          user: null,
          map: new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            center: {lat: -33.8688, lng: 151.2195},
            zoom: 13,
            disableDefaultUI: true
          }),
          directionsService: new google.maps.DirectionsService,
          directionsDisplay: new google.maps.DirectionsRenderer,
          distance: null,
          duration: null,
        };
        $scope.data.directionsDisplay.setMap($scope.data.map);
        $scope.getThumbnailUrl = function (imageId) {
          return GeneralService.getThumbnailUrl(imageId);
        };
        TripService.tripDetailSubscribe($scope.data, $scope);

        function route(origin, destination, directionsService, callback) {
          GoogleMapService.route(origin, destination, directionsService,
            callback);
        }

        $scope.helpers({
            direction: function () {
              if ($scope.getReactively('data.roadMap')) {
                route(
                  $scope.data.roadMap.origin.name,
                  $scope.data.roadMap.destination.name,
                  $scope.data.directionsService,
                  function (err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      $scope.data.distance = result.routes[0].legs[0].distance;
                      $scope.data.duration = result.routes[0].legs[0].duration;
                      $scope.data.directionsDisplay.setDirections(result);
                    }
                  }
                )
              }
            }
          }
        )
//$scope.moreDataCanBeLoad = function () {
//  return true;
//}
//$scope.loadMore = function () {
//  var remain = $scope.searchData.rowCount - $scope.searchData.limit;
//  if (remain > 5) {
//    $scope.searchData.limit += 5;
//  } else if (remain > 0) {
//    $scope.searchData.limit += remain;
//  } else {
//    $scope.vm.noMoreItemAvailable = true;
//  }
//  $timeout(function () {
//    $scope.$broadcast('scroll.infiniteScrollComplete');
//  }, 200);
//}
      }
    ]
  )
