angular.module('app.services.login', [])
  .factory('LoginService', function () {
    _signUp = function (user, callback) {
      Accounts.createUser(user, callback);
    };
    _signIn = function (email, password, callback) {
      Meteor.loginWithPassword(email, password, callback);
    };
    _logOut = function (callback) {
      Meteor.logout(callback);
    };
    _changePassword = function (oldPassWord, newPassWord, callback) {
      Accounts.changePassword(oldPassWord, newPassWord, callback);
    };
    _forgotPassword = function (email, callback) {
      Accounts.forgotPassword({email: email}, callback);
    };
    _resetPassword = function (token, newPassWord, callback) {
      Accounts.resetPassword(token, newPassWord, callback);
    };
    _logoutOtherClients = function (callback) {
      Meteor.logoutOtherClients(callback);
    };
    _checkTokenExpired = function (token, callback) {
      Meteor.call('checkTokenExpired', token, callback);
    };
    _facebookLogin = function (accessToken, callback) {
      var loginRequest = {facebook: true, accessToken: accessToken};
      Accounts.callLoginMethod({
        methodArguments: [loginRequest],
        userCallback: callback
      });
    };
    return {
      signUp: _signUp,
      signIn: _signIn,
      logOut: _logOut,
      changePassword: _changePassword,
      forgotPassword: _forgotPassword,
      resetPassword: _resetPassword,
      logoutOtherClients: _logoutOtherClients,
      checkTokenExpired: _checkTokenExpired,
      facebookLogin: _facebookLogin
    };
  });
