angular.module('app.services.trips', [])
  .factory('TripService', ['$meteor', '$reactive', function ($meteor, $reactive) {
    tripSearchSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('trip_search', function () {
        return [
          reactiveContext.getReactively('origin_latlng'),
          reactiveContext.getReactively('destination_latlng'),
          reactiveContext.getReactively('distance'),
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
        tripSearchData: function () {
          return Trips.find(
            {startAt: {$gte: new Date()}},
            {limit: parseInt(reactiveContext.getReactively('limit'))}).fetch()
        },
        rowCount: function () {
          return Counts.get('trip_search');
        },
      });
    };
    tripDetailSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('trip_detail', function () {
        return [
          reactiveContext.getReactively('tripId'),
          parseInt(reactiveContext.getReactively('limit')),
        ]
      }, {
        onReady: function () {
          console.log("onReady And the Items actually Arrive");
          reactiveContext.callback(false, "done");
        },
        onStop: function (error) {
          if (error) {
            console.log('An error happened - ', error);
            reactiveContext.callback(error);
          } else {
            console.log('The subscription stopped');
          }
        }
      });
      reactiveContext.helpers({
        trip: function () {
          return Trips.findOne({
              $and: [
                {_id: reactiveContext.getReactively('tripId')},
                {isDeleted: false}
              ]
            }
          )
        },
        user: function () {
          var trip = Trips.findOne({
              $and: [
                {_id: reactiveContext.getReactively('tripId')},
                {isDeleted: false}
              ]
            }
          );
          if (trip)
            return Meteor.users.findOne({
                $and: [
                  {_id: trip.owner},
                  {isDeleted: false}
                ]
              }
            );
        },
        //feedbackCount: function () {
        //  return Counts.get('trip_detail');
        //},
      });
    }
    ;
    createATrip = function (param, callback) {
      Meteor.call('createATrip', param, callback);
    };
    return {
      createATrip: createATrip,
      tripSearchSubscribe: tripSearchSubscribe,
      tripDetailSubscribe: tripDetailSubscribe,
    };
  }])
