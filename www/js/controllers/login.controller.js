angular.module('app.login.controllers', [])
  .controller('loginCtrl', ['$scope', 'LoginService', '$state', '$ionicHistory',
    '$q', '$cordovaFacebook', '$ionicLoading', '$ionicPopup',
    function ($scope, LoginService, $state, $ionicHistory, $q, $cordovaFacebook, $ionicLoading, $ionicPopup) {
      $scope.user = {
        email: null,
        password: null
      };
      if (Meteor.userId()) {//already logined
        $state.go('menu.home');
      }
      $scope.showAlert = function (value) {
        var alertPopup = $ionicPopup.alert({
          title: value,
          template: '',
        });
      };

      $scope.login = function () {
        $ionicLoading.show();
        //this.ionicToast.show(message, position, stick, time);
        LoginService.signIn($scope.user.email, $scope.user.password, (function (err) {
          $ionicLoading.hide();
          if (err) {
            $scope.showAlert(err.reason);
          } else {
            console.log("LOGIN SUCCESS");
            $scope.login_success();
          }
        }));
      };

      $scope.login_success = function () {
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        if ($ionicHistory.viewHistory().backView) {
          $ionicHistory.goBack();
        } else {
          $state.go('menu.home');
        }
      }

      $scope.fbUserLoginToSystem = function (authResponse) {
        this.authResponse = authResponse;
        LoginService.facebookLogin(this.authResponse.accessToken, function (error, result) {
          console.log("Meteor login FB", error, result);
        });
        $ionicLoading.hide();
        $scope.login_success();
      };

      $scope.fbLoginSuccess = function (response) {
        console.log("fbLoginSuccess", response);
        if (!response.authResponse) {
          $scope.fbLoginError("Cannot find the authResponse");
          return;
        }
        var authResponse = response.authResponse;
        $scope.fbUserLoginToSystem(authResponse);
      };

      $scope.fbLoginError = function (error) {
        console.log('fbLoginError', error);
        $ionicLoading.hide();
      };

      //This method is executed when the user press the "Login with facebook" button
      $scope.facebookSignIn = function () {
        console.log("Trying loging facebook");
        $cordovaFacebook.getLoginStatus()
          .then(function (success) {
            console.log("sucess", success);
            if (success.status === 'connected') {

              $scope.fbUserLoginToSystem(success.authResponse);
            } else {
              console.log('getLoginStatus', success.status);
              $ionicLoading.show();
              // Ask the permissions you need. You can learn more about
              // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
              $cordovaFacebook.login(["public_profile", "email", 'user_birthday'])
                .then(
                  $scope.fbLoginSuccess.bind(this),
                  $scope.fbLoginError.bind(this)
                );
            }
          }, function (error) {
            $scope.showAlert(error);
          });
      };
    }]);
