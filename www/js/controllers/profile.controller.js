angular.module('app.profile.controllers', [])

  .controller('profileCtrl', ['GeneralService', '$scope', '$state', function (GeneralService, $scope, $state) {
    $scope.helpers({
      isLoggedIn: function () {
        return Meteor.userId() !== null;
      },
      information_user: function () {
        return Meteor.user();
      },
      avatarUrl: function () {
        if (Meteor.user() && Meteor.user().publicProfile) {
          return GeneralService.getThumbnailUrl(Meteor.user().publicProfile.avatar);
        } else {
          return GeneralService.getThumbnailUrl();
        }
      }
    });
  }])
