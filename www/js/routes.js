angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


      .state('menu.home', {
        url: '/',
        views: {
          'side-menu21': {
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl'
          }
        }
      })

      .state('menu', {
        url: '/home',
        templateUrl: 'templates/menu.html',
        abstract: true,
        controller: 'menuCtrl'
      })

      .state('menu.login', {
        url: '/login',
        views: {
          'side-menu21': {
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl',
            resolve: {
              'currentUser': [
                '$meteor', '$state', function ($meteor, $state) {
                  $meteor.waitForUser().then(function (user) {
                    if (user) {
                      return $state.go('menu.home');
                    }
                  }, function (error) {
                    return console.log("error", error);
                  });
                }
              ]
            }
          }
        }
      })

      .state('menu.signup', {
        url: '/sginup',
        views: {
          'side-menu21': {
            templateUrl: 'templates/signup.html',
            controller: 'signupCtrl',
            resolve: {
              'currentUser': [
                '$meteor', '$state', function ($meteor, $state) {
                  $meteor.waitForUser().then(function (user) {
                    if (user) {
                      return $state.go('menu.home');
                    }
                  }, function (error) {
                    return console.log("error", error);
                  });
                }
              ]
            }
          }
        }
      })

      .state('menu.notifications', {
        url: '/notifications',
        views: {
          'side-menu21': {
            templateUrl: 'templates/notifications.html',
            controller: 'notificationsCtrl'
          }
        }
      })

      .state('menu.myTrips', {
        url: '/trips/manager',
        views: {
          'side-menu21': {
            templateUrl: 'templates/myTrips.html',
            controller: 'myTripsCtrl'
          }
        }
      })

      .state('menu.newTrip', {
        url: '/trips/add',
        views: {
          'side-menu21': {
            templateUrl: 'templates/newTrip.html',
            controller: 'newTripCtrl'
          }
        }
      })

      .state('menu.search', {
        url: '/search',
        params: {
          originSearch: null,
          origin_latlng: null,
          destinationSearch: null,
          destination_latlng: null,
        },
        views: {
          'side-menu21': {
            templateUrl: 'templates/search.html',
            controller: 'searchCtrl'
          }
        }
      })

      .state('menu.profile', {
        url: '/profile',
        views: {
          'side-menu21': {
            templateUrl: 'templates/profile.html',
            controller: 'profileCtrl'
          }
        }
      })

      .state('menu.editProfile', {
        url: '/editProfile',
        views: {
          'side-menu21': {
            templateUrl: 'templates/editProfile.html',
            controller: 'editProfileCtrl'
          }
        }
      })

      .state('menu.myReservations', {
        url: '/myReservations',
        views: {
          'side-menu21': {
            templateUrl: 'templates/myReservations.html',
            controller: 'myReservationsCtrl'
          }
        }
      })
      .state('menu.tripDetail', {
        url: '/roadMap/:roadMapId',
        views: {
          'side-menu21': {
            templateUrl: 'templates/tripDetail.html',
            controller: 'tripDetailCtrl'
          }
        }
      })

      .state('menu.userProfile', {
        url: '/userProfile/:userId',
        views: {
          'side-menu21': {
            templateUrl: 'templates/userProfile.html',
            controller: 'userProfileCtrl'
          }
        }
      })

    $urlRouterProvider.otherwise('/home/')


  });
