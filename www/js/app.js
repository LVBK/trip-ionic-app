// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', [
    'ionic',
    'ngCordova',
    'ngMessages',
    'ngMap',
    'angular-meteor',
    'ion-datetime-picker',
    'onezone-datepicker',
    'app.controllers',
    'app.routes',
    'app.services',
    'app.directives',
  ])
  //.config(['$cordovaFacebookProvider', function ($cordovaFacebookProvider) {
  //  $cordovaFacebookProvider.browserInit(_FB_APP_ID, _FB_APP_VERSION);
  //}])
  .run(['$ionicPlatform', function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs
      facebookConnectPlugin.browserInit(_FB_APP_ID, _FB_APP_VERSION);
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  }])
