angular.module('app.editProfile.controllers', [])

  .controller('editProfileCtrl', ['LoginService', 'GeneralService', '$interval', '$reactive', '$scope',
    'ImgInput', '$ionicLoading', '$ionicPopup',
    function (LoginService, GeneralService, $interval, $reactive, $scope,
              ImgInput, $ionicLoading, $ionicPopup) {

      $scope. chattinessOptions = [
        {name: "I'm the quiet type", value: "bla"},
        {name: "Depending on my mood", value: "blabla"},
        {name: "I love to chat", value: "blablabla"}
      ];
      $scope. smokingOptions = [
        {name: 'No smoking', value: 'nosmoke'},
        {name: 'Smoking is OK sometimes', value: 'sometimes'},
        {name: "Doesn't bother me", value: 'smoke'},
      ];
      $scope. petsOptions = [
        {name: "No pets please", value: "nopet"},
        {name: "Depends on the animal", value: "depend"},
        {name: "I love pets", value: "fine"},
      ];
      $scope. musicOptions = [
        {name: "silence is golden", value: "silence"},
        {name: "listen if i fancy it", value: "fancy"},
        {name: "i love music", value: "all"}
      ];
      $scope.fileData = null;
      $scope.currentUser = null;
      $scope.passwordData = {
        oldPassword: null,
        newPassword: null,
        rePassword: null,
      }
      $scope.helpers({
        isLoggedIn: function () {
          return Meteor.userId() !== null;
        },
        information_user: function () {
          return Meteor.user();
        },
        avatarUrl: function () {
          if (Meteor.user()) {
            return GeneralService.getThumbnailUrl(Meteor.user().avatar);
          } else {
            return GeneralService.getThumbnailUrl();
          }
        }
      });
      $scope.getFile = function () {
        console.log("haha");
        $scope.progress = 0;
        ImgInput.readAsDataUrl(this.file, $scope)
          .then((function (result) {
            $ionicLoading.show();
            $scope.fileData = result;
            GeneralService.userUploadProfileImage(result, $scope.save_callback);
          }));
      };

      $scope.avatar_save = function (fileData) {
        $ionicLoading.show();
        GeneralService.userUploadProfileImage(fileData, $scope.save_callback);
      }

      $scope.avatar_cancel = function () {
        $scope.fileData = null;
      }

      $scope.profile_save = function (modifier) {
        $ionicLoading.show();
        var profileData = {
          name: modifier.name,
          birthday: modifier.birthday,
          gender: modifier.gender,
          phoneNumber: modifier.phoneNumber,
          address: modifier.address,
          chattiness: modifier.chattiness,
          smoking: modifier.smoking,
          pets: modifier.pets,
          music: modifier.music,
        };
        GeneralService.userChangeProfile(profileData, $scope.save_callback);
      };

      $scope.profile_cancel = function () {
        $scope.helpers({
          information_user: function () {
            return Meteor.user();
          }
        });
      };
      $scope.showAlert = function (value) {
        var alertPopup = $ionicPopup.alert({
          title: value,
          template: '',
        });
      }

      $scope.save_callback = function (error, response) {
        $ionicLoading.hide();
        if (error) {
          $scope.showAlert(error.reason);
          $scope.fileData = null;
        } else {
          $scope.showAlert('Saved!');
          console.log('response:', response);
        }
      };
      $scope.password_save = function () {
        if ($scope.passwordData.oldPassword == null) {
          $scope.showAlert('Olld password field can not be empty');
        } else if ($scope.passwordData.newPassword == null) {
          $scope.showAlert('New password field can not be empty');
        } else if ($scope.passwordData.rePassword == null) {
          $scope.showAlert('Confirm password field can not be empty');
        } else if ($scope.passwordData.newPassword != $scope.passwordData.rePassword) {
          $scope.showAlert('New password and Confirm password not match!');
        } else {
          $ionicLoading.show();
          LoginService.changePassword($scope.passwordData.oldPassword,
            $scope.passwordData.newPassword, $scope.save_callback);
        }
      };
      $scope.password_cancel = function () {
        $scope.passwordData.oldPassword = null;
        $scope.passwordData.newPassword = null;
        $scope.passwordData.rePassword = null;
      };
    }])
  .directive("ngFileSelect", function () {
    return {
      link: function ($scope, el) {
        el.bind("change", function (e) {
          $scope.file = (e.srcElement || e.target).files[0];
          $scope.getFile();
        });
      }
    }
  });
