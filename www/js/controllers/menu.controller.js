angular.module('app.menu.controllers', [])
  .controller('menuCtrl', ['$state', 'GeneralService', '$reactive', '$scope', 'LoginService', '$ionicPopup',
    function ($state, GeneralService, $reactive, $scope, LoginService, $ionicPopup) {
      $reactive(this).attach($scope);
      $scope.showAlert = function (value) {
        var alertPopup = this.$ionicPopup.alert({
          title: value,
          template: '',
        });
      };
      $scope.helpers({
        isLoggedIn: function () {
          return Meteor.userId() !== null;
        },
        currentUser: function () {
          return Meteor.user();
        },
        avatarUrl: function () {
          if (Meteor.user()) {
            return GeneralService.getThumbnailUrl(Meteor.user().avatar);
          } else {
            return GeneralService.getThumbnailUrl();
          }
        },
        unReadCount: function(){
          return Counts.get('notifications_unread');
        }
      });
      $scope.logout = function () {
        LoginService.logOut((function (err) {
          if (err) {
            $scope.showAlert(err.reason);
          } else {
            console.log("LOGout SUCCESS");
          }
        }).bind(this));
      };
    }])
