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
              if ($scope.getReactively('origin') && $scope.getReactively('destination')) {
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
  .directive('tripSlot', function () {
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
  .directive('myReservationItem', function () {
      var controller = ['$scope', 'BookService', '$ionicLoading',
        function ($scope, BookService, $ionicLoading) {
          $scope.getTrip = function (tripId) {
            return Trips.findOne(tripId);
          };
          $scope.bookCancel = function (reservationId) {
            $ionicLoading.show();
            BookService.bookCancel(reservationId, function (err, result) {
              //console.log(err, result);
              $ionicLoading.hide();
              if (err) {
                $scope.showAlert({arg1: err.reason});
              } else {
                $scope.showAlert({arg1: result});
              }
            })
          }
        }]
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          reservation: '=',
          showAlert: '&'
        },
        controller: controller,
        link: function (scope, element, attrs) {
        },
        templateUrl: './../templates/myReservationItem.html'
      };
    }
  )
  .directive('reservationItem', function () {
      var controller = ['$scope', 'BookService', '$ionicLoading',
        function ($scope, BookService, $ionicLoading) {
          $scope.getTrip = function (tripId) {
            return Trips.findOne(tripId);
          };
          $scope.getUser = function (userId) {
            return Meteor.users.findOne(userId);
          };
          $scope.bookAccept = function (reservationId) {
            $ionicLoading.show();
            BookService.bookAccept(reservationId, function (err, result) {
              console.log(err, result);
              $ionicLoading.hide();
              if (err) {
                $scope.showAlert({arg1: err.reason});
              } else {
                $scope.showAlert({arg1: result});
              }
            })
          };
          $scope.bookDeny = function (reservationId) {
            $ionicLoading.show();
            BookService.bookDeny(reservationId, function (err, result) {
              console.log(err, result);
              $ionicLoading.hide();
              if (err) {
                $scope.showAlert({arg1: err.reason});
              } else {
                $scope.showAlert({arg1: result});
              }
            })
          }
        }]
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          reservation: '=',
          showAlert: '&'
        },
        controller: controller,
        link: function (scope, element, attrs) {
        },
        templateUrl: './../templates/reservationItem.html'
      };
    }
  )
  .directive('notificationItem', function () {
      var controller = ['$scope', 'NotificationService', 'GeneralService',
        function ($scope, NotificationService, GeneralService) {
          $scope.helpers({
            sender: function () {
              return Meteor.users.findOne({_id: $scope.notification.senderId});
            },
            action: function () {
              return ActionTypes.findOne({type: $scope.notification.actionType});
            },
            content: function () {
              return NotificationTypes.findOne({type: $scope.notification.notificationType});
            }
          })
          $scope.markAsRead = function (notificationId) {
            NotificationService.markAsRead(notificationId)
          };
          $scope.getThumbnailUrl = function (imageId) {
            return GeneralService.getThumbnailUrl(imageId);
          }
        }]
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          notification: '=',
        },
        controller: controller,
        link: function (scope, element, attrs) {
        },
        templateUrl: './../templates/notificationItem.html'
      };
    }
  )
  .directive('feedbackItem', function () {
      var controller = ['$scope', 'GeneralService',
        function ($scope, GeneralService) {
          $scope.rating = {
            max: 5,
            readOnly: true
          };
          $scope.helpers({
            user: function () {
              return Meteor.users.findOne({_id: $scope.feedback.from});
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
          feedback: '=',
        },
        controller: controller,
        link: function (scope, element, attrs) {
        },
        templateUrl: './../templates/feedbackItem.html'
      };
    }
  )
  .directive('commentItem', function () {
      var controller = ['$scope', 'GeneralService',
        function ($scope, GeneralService) {
          $scope.helpers({
            user: function(){
              return Meteor.users.findOne({_id: $scope.comment.from});
            },
            currentUser: function () {
              return Meteor.user();
            },
          });
          $scope.getThumbnailUrl = function (imageId) {
            return GeneralService.getThumbnailUrl(imageId);
          };
        }]
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          comment: '=',
          tripId: '=',
          currentReplyWidgetVisible: '=',
          showReplyWidget: '&'
        },
        controller: controller,
        link: function (scope, element, attrs) {
        },
        templateUrl: './../templates/commentItem.html'
      };
    }
  )
  .directive('replyDirective', function () {
    var controller = ['$scope', 'CommentService', '$ionicLoading', '$ionicPopup',
      function ($scope, CommentService, $ionicLoading, $ionicPopup) {
        $scope.data = {
          commentText: null
        };
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
        $scope.reply = function (tripId, receiveUserId, content) {
          console.log(tripId, receiveUserId, content);
          $ionicLoading.show();
          CommentService.comment(tripId, receiveUserId, content, function (err, result) {
            $ionicLoading.hide();
            if (err) {
              $scope.showAlert(err.reason);
            } else {
              $scope.data.commentText = null;
            }
          });
        };
      }]
    return {
      restrict: 'E',
      scope: {
        comment: '=',
        currentReplyWidgetVisible: '=',
        tripId: '='
      },
      controller: controller,
      templateUrl: './../templates/reply.html',
      link: function (scope) {
        scope.comment.replyWidgetVisible = false;

        scope.publishReply = function (i, o) {
          scope.$emit('publish', i, scope.comment.id, o);
        }
      }
    };
  });
