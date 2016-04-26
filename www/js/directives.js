angular.module('app.directives', [])

  .directive('googleMapDirection', [function () {
    var controller = ['$scope', 'GoogleMapService',
      function ($scope, GoogleMapService) {
        $scope.map = new google.maps.Map(document.getElementById('google-map'), {
          mapTypeControl: false,
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          disableDefaultUI: true
        });
        $scope.directionsService = new google.maps.DirectionsService;
        $scope.directionsDisplay = new google.maps.DirectionsRenderer;
        $scope.distance = null;
        $scope.duration = null;

        $scope.directionsDisplay.setMap($scope.map);

        function route(origin, destination, directionsService, callback) {
          GoogleMapService.route(origin, destination, directionsService,
            callback);
        }

        $scope.helpers({
            direction: function () {
              if ($scope.getReactively('origin') && $scope.getReactively('destination'))  {
                route(
                  $scope.origin,
                  $scope.destination,
                  $scope.directionsService,
                  function (err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      $scope.distance = result.routes[0].legs[0].distance;
                      $scope.duration = result.routes[0].legs[0].duration;
                      $scope.directionsDisplay.setDirections(result);
                    }
                  }
                )
              }
            }
          }
        )
      }
    ]
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        origin: '@',
        destination: '@'
      },
      controller: controller,
      link: function (scope, element, attrs) {
      },
      templateUrl: './../templates/googleMap.html'
    };
  }])
  .directive('roadMapSlot', function () {
      var controller = ['$scope', 'GeneralService', function ($scope, GeneralService) {
        $scope.helpers({
          user: function () {
            return Meteor.users.findOne({_id: $scope.userId});
          }
        });
        $scope.getThumbnailUrl = function (imageId) {
          return GeneralService.getThumbnailUrl(imageId);
        }
      }]
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          userId: '=',
        },
        controller: controller,
        link: function (scope, element, attrs) {
        },
        template: '<img ui-sref="menu.userProfile(::{userId: user._id})" ng-src={{getThumbnailUrl(user.publicProfile.avatar)}} class="slot">'
      };
    }
  )
