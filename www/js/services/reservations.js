angular.module('app.services.reservations', [])
  .factory('BookService', ['$meteor', '$reactive', function ($meteor, $reactive) {
    reservationFromMeSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('reservation_from_me', function () {
        return [
          reactiveContext.getReactively('date'),
          parseInt(reactiveContext.getReactively('limit')),
        ]
      }, {
        onReady: function () {
          console.log("onReady And the Items actually Arrive");
        },
        onStop: function (error) {
          if (error) {
            console.log('An error happened - ', error);
          } else {
            console.log('The subscription stopped');
          }
        }
      });
      reactiveContext.helpers({
        reservations: function () {
          return Reservations.find(
            {
              $and: [
                {
                  userId: Meteor.userId(),
                },
                {
                  startAt: {$gte: new Date()}
                }
              ]
            },
            {
              limit: parseInt(reactiveContext.getReactively('limit')),
            }
          ).fetch()
        },
        rowCount: function () {
          return Counts.get('reservation_from_me');
        },
      });
    };
    reservationToMeSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('reservation_to_me', function () {
        return [
          reactiveContext.getReactively('date'),
          parseInt(reactiveContext.getReactively('limit')),
        ]
      }, {
        onReady: function () {
          console.log("onReady And the Items actually Arrive");
        },
        onStop: function (error) {
          if (error) {
            console.log('An error happened - ', error);
          } else {
            console.log('The subscription stopped');
          }
        }
      });
      reactiveContext.helpers({
        reservations: function () {
          return Reservations.find(
            {
              $and: [
                {
                  to: Meteor.userId(),
                },
                {
                  startAt: {$gte: new Date()}
                }
              ]
            },
            {
              limit: parseInt(reactiveContext.getReactively('limit')),
            }
          ).fetch()
        },
        rowCount: function () {
          return Counts.get('reservation_to_me');
        },
      });
    };
    bookSeats = function(roadMapId, totalSeats, callback){
      Meteor.call('bookSeats', roadMapId, totalSeats, callback);
    };
    bookCancel = function(reservationId, callback){
      Meteor.call('bookCancel', reservationId, callback);
    };
    bookDeny = function(reservationId, callback){
      Meteor.call('bookDeny', reservationId, callback);
    };
    bookAccept = function(reservationId, callback){
      Meteor.call('bookAccept', reservationId, callback);
    };
    return {
      reservationFromMeSubscribe: reservationFromMeSubscribe,
      reservationToMeSubscribe: reservationToMeSubscribe,
      bookSeats: bookSeats,
      bookCancel: bookCancel,
      bookDeny: bookDeny,
      bookAccept: bookAccept
    };
  }])
