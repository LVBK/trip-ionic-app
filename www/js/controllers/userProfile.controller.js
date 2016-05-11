angular.module('app.userProfile.controllers', [])

  .controller('userProfileCtrl', ['$scope', '$stateParams', 'GeneralService', 'UserService', 'FeedbackService', '$timeout',
    function ($scope, $stateParams, GeneralService, UserService, FeedbackService, $timeout) {
      $scope.data = {
        userId: $stateParams.userId,
        user: null,
        feedbacks: [],
        limit: 5,
        rowCount: 0,
        noMoreItemAvailable: false,
      };
      $scope.getThumbnailUrl = function (imageId) {
        return GeneralService.getThumbnailUrl(imageId);
      };
      $scope.helpers({
        noItemAvailable: function () {
          if ($scope.getReactively('data.feedbacks')) {
            if ($scope.data.feedbacks.length > 0) {
              return false
            }
          }
          return true;
        }
      });
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
      UserService.userDetailSubscribe($scope.data, $scope);
      FeedbackService.feedbacksSubscribe($scope.data, $scope);

    }])
