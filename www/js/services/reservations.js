angular.module('app.services.reservations', [])
  .factory('BookService', ['$meteor', '$reactive', function ($meteor, $reactive) {
    reservationFromMeSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('reservation_from_me', function () {
        return [
          reactiveContext.getReactively('filterState'),
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
          var stateSelector = {};
          if (reactiveContext.getReactively('filterState')) {
            stateSelector = {bookState: reactiveContext.filterState};
          }
          return Reservations.find(
            {
              $and: [
                {
                  userId: Meteor.userId(),
                },
                {
                  startAt: {$gte: reactiveContext.getReactively('date')}
                },
                stateSelector
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
              sort: {
                bookState: -1
              }
            }
          ).fetch()
        },
        rowCount: function () {
          return Counts.get('reservation_to_me');
        },
      });
    };
    bookSeats = function (tripId, totalSeats, callback) {
      Meteor.call('bookSeats', tripId, totalSeats, callback);
    };
    bookCancel = function (reservationId, callback) {
      //callback(false, "success");
      Meteor.call('bookCancel', reservationId, callback);
    };
    bookDeny = function (reservationId, callback) {
      Meteor.call('bookDeny', reservationId, callback);
    };
    bookAccept = function (reservationId, callback) {
      Meteor.call('bookAccept', reservationId, callback);
    };
    myReservationDetailSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('my_reservation_detail', function () {
        return [
          reactiveContext.getReactively('reservationId')
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
        reservation: function () {
          return Reservations.findOne(
            {
              $and: [
                {_id: reactiveContext.getReactively('reservationId')},
                {
                  userId: Meteor.userId(),
                },
              ]
            }
          )
        },
        trip: function () {
          var reservation = Reservations.findOne(
            {
              $and: [
                {_id: reactiveContext.getReactively('reservationId')},
                {
                  userId: Meteor.userId(),
                },
              ]
            }
          );
          if (reservation)
            return Trips.findOne({_id: reservation.tripId});
        },
        user: function () {
          var reservation = Reservations.findOne(
            {
              $and: [
                {_id: reactiveContext.getReactively('reservationId')},
                {
                  userId: Meteor.userId(),
                },
              ]
            }
          );
          if (reservation)
            return Meteor.users.findOne({_id: reservation.to});
        },
      });
    };
    reservationDetailSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('reservation_detail', function () {
        return [
          reactiveContext.getReactively('reservationId')
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
        reservation: function () {
          return Reservations.findOne(
            {
              $and: [
                {_id: reactiveContext.getReactively('reservationId')},
                {
                  to: Meteor.userId(),
                },
              ]
            }
          )
        },
        trip: function () {
          var reservation = Reservations.findOne(
            {
              $and: [
                {_id: reactiveContext.getReactively('reservationId')},
                {
                  to: Meteor.userId(),
                },
              ]
            }
          );
          if (reservation)
            return Trips.findOne({_id: reservation.tripId});
        },
        user: function () {
          var reservation = Reservations.findOne(
            {
              $and: [
                {_id: reactiveContext.getReactively('reservationId')},
                {
                  to: Meteor.userId(),
                },
              ]
            }
          );
          if (reservation)
            return Meteor.users.findOne({_id: reservation.userId});
        },
      });
    };
    return {
      reservationFromMeSubscribe: reservationFromMeSubscribe,
      reservationToMeSubscribe: reservationToMeSubscribe,
      bookSeats: bookSeats,
      bookCancel: bookCancel,
      bookDeny: bookDeny,
      bookAccept: bookAccept,
      myReservationDetailSubscribe: myReservationDetailSubscribe,
      reservationDetailSubscribe: reservationDetailSubscribe
    };
  }])
