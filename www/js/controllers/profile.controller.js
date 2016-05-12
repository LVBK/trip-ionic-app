angular.module('app.profile.controllers', [])

  .controller('profileCtrl', ['GeneralService', '$scope', '$state', function (GeneralService, $scope, $state) {
    $scope.getThumbnailUrl = function (imageId) {
      return GeneralService.getThumbnailUrl(imageId);
    };
    $scope.helpers({
      isLoggedIn: function () {
        return Meteor.userId() !== null;
      },
      information_user: function () {
        return Meteor.user();
      }
    });
  }])
