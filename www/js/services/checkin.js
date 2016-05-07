angular.module('app.services.checkin', [])
  .factory('CheckInService', ['$meteor', '$reactive', function ($meteor, $reactive) {
    checkInTicketsSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('checkInTickets', function () {
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
        tickets: function () {
          var stateSelector = {};
          if (reactiveContext.getReactively('filterState')) {
            stateSelector = {state: reactiveContext.filterState};
          }
          return CheckInTickets.find(
            {
              $and: [
                {
                  userId: Meteor.userId(),
                },
                {isDeleted: false},
                stateSelector
              ]
            },
            {
              limit: parseInt(reactiveContext.getReactively('limit')),
            }
          ).fetch()
        },
        rowCount: function () {
          return Counts.get('checkInTickets');
        },
      });
    };
    checkInTicketDetailSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('checkInTicket', function () {
        return [
          reactiveContext.getReactively('checkInTicketId'),
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
        ticket: function () {
          return CheckInTickets.findOne(
            {
              $and: [
                {
                  userId: Meteor.userId(),
                },
                {_id: reactiveContext.getReactively('checkInTicketId')}
              ]
            }
          )
        },
        trip: function () {
          var ticket = CheckInTickets.findOne(
            {
              $and: [
                {
                  userId: Meteor.userId(),
                },
                {_id: reactiveContext.getReactively('checkInTicketId')}
              ]
            }
          );
          if (ticket)
            return Trips.findOne({_id: ticket.tripId});
        },
      });
    };
    checkIn = function (checkInTicketId, checkOutPassword, checkOutLimitMinute, checkInLocation, callback) {
      Meteor.call('checkIn', checkInTicketId, checkOutPassword, checkOutLimitMinute, checkInLocation, callback);
    };
    checkOut = function (checkInTicketId, checkOutPassword, checkOutLocation, callback) {
      Meteor.call('checkOut', checkInTicketId, checkOutPassword, checkOutLocation, callback);
    };
    return {
      checkInTicketsSubscribe: checkInTicketsSubscribe,
      checkIn: checkIn,
      checkOut: checkOut,
      checkInTicketDetailSubscribe: checkInTicketDetailSubscribe,
    };
  }])
