angular.module('app.userProfile.controllers', [])

  .controller('userProfileCtrl', ['$scope', '$stateParams', 'GeneralService', 'UserService',
    function ($scope, $stateParams, GeneralService, UserService) {
      $scope.data = {
        userId: $stateParams.userId,
        user: null,
      };
      $scope.getThumbnailUrl = function (imageId) {
        return GeneralService.getThumbnailUrl(imageId);
      };
      UserService.userDetailSubscribe($scope.data, $scope);
    }])
