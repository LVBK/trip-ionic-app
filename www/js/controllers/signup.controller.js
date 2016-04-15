angular.module('app.signup.controllers', [])

  .controller('signupCtrl', ['LoginService', '$state', '$ionicHistory', '$scope', '$ionicLoading', '$ionicPopup',
    function (LoginService, $state, $ionicHistory, $scope, $ionicLoading, $ionicPopup) {
      $scope.user = {
        email: '', //Need,
        password: '',	//need
        retypePassword: '',
        publicProfile: {
          name: '',
          gender: "Male",
          birthday: '',
        }
      }
      $scope.showAlert = function (value) {
        var alertPopup = $ionicPopup.alert({
          title: value,
          template:  '',
        });
      };
      $scope.signup_success = function () {
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
      $scope.signUp = function (){
        var user = this.user;
        $ionicLoading.show();
        if(user.password!=user.retypePassword){
          $ionicLoading.hide();
          $scope.showAlert('Password and Confirm password not match!');
        }else {
          LoginService.signUp(user, (function (err) {
            $ionicLoading.hide();
            if (err) {
              $scope.showAlert(err.reason);
            } else {
              $scope.signup_success();
            }
          }));
        }
      }
    }])
