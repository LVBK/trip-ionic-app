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
            {isDeleted: false},
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
          return Trips.findOne({_id: reactiveContext.getReactively('tripId')});
        },
        user: function () {
          var trip = Trips.findOne({_id: reactiveContext.getReactively('tripId')});
          if (trip)
            return Meteor.users.findOne({_id: trip.owner});
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
    updateTrip = function (tripId, modifier, callback) {
      Meteor.call('updateTrip', tripId, modifier, callback);
    };
    deleteTrip = function (tripId, callback) {
      Meteor.call('deleteTrip', tripId, callback);
    };
    myTripsSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('my_trips', function () {
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
        trips: function () {
          return Trips.find(
            {startAt: {$gte: reactiveContext.getReactively('date')}},
            {isDeleted: false},
            {limit: parseInt(reactiveContext.getReactively('limit'))}).fetch()
        },
        rowCount: function () {
          return Counts.get('my_trips');
        },
      });
    };
    return {
      createATrip: createATrip,
      updateTrip: updateTrip,
      deleteTrip: deleteTrip,
      tripSearchSubscribe: tripSearchSubscribe,
      tripDetailSubscribe: tripDetailSubscribe,
      myTripsSubscribe: myTripsSubscribe,
    };
  }])
