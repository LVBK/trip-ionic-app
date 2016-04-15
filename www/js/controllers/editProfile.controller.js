angular.module('app.editProfile.controllers', [])

  .controller('editProfileCtrl', ['LoginService', 'GeneralService', '$interval', '$reactive', '$scope',
    'ImgInput', '$ionicLoading', '$ionicPopup',
    function (LoginService, GeneralService, $interval, $reactive, $scope,
              ImgInput, $ionicLoading, $ionicPopup) {
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
          if (Meteor.user() && Meteor.user().publicProfile) {
            return GeneralService.getThumbnailUrl(Meteor.user().publicProfile.avatar);
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

      $scope.profile_save = function (publicProfile, privateProfile) {
        $ionicLoading.show();
        var profileData = {
          publicProfile: {
            name: publicProfile.name,
            birthday: publicProfile.birthday,
            gender: publicProfile.gender
          },
          privateProfile: {
            phoneNumber: privateProfile.phoneNumber,
            address: privateProfile.address,
          }
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
          $scope.showAlert(error.message);
          $scope.fileData = null;
        } else {
          $scope.showAlert('Lưu thành công');
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
