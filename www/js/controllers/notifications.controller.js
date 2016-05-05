angular.module('app.notifications.controllers', [])

  .controller('notificationsCtrl', ['$scope', 'GeneralService', 'NotificationService', '$timeout',
    function ($scope, GeneralService, NotificationService, $timeout) {
      $scope.vm = {
        limit: 5,
        rowCount: 0,
        notifications: [],
        noMoreItemAvailable: false,
      };
      $scope.helpers({
        isLoggedIn: function () {
          return Meteor.userId() !== null;
        },
        noItemAvailable: function () {
          if ($scope.getReactively('vm.notifications')) {
            if ($scope.vm.notifications.length > 0) {
              return false
            }
          }
          return true;
        }
      });

      NotificationService.notificationSubscribe($scope.vm, $scope);
      $scope.markAllAsRead = function () {
        NotificationService.markAllAsRead();
      };

      $scope.loadMore = function () {
        var remain = $scope.vm.rowCount - $scope.vm.limit;
        if (remain > 5) {
          $scope.vm.limit += 5;
        } else if (remain > 0) {
          $scope.vm.limit += remain;
        } else {
          $scope.vm.noMoreItemAvailable = true;
        }
        $timeout(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 200);
      };
    }])
