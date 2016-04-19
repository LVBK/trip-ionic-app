angular.module('app.services.trips', [])
  .factory('TripService', ['$meteor', '$reactive', function ($meteor, $reactive) {
    tripSearchSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('trip_search', function () {
        return [
          reactiveContext.getReactively('origin_latlng'),
          reactiveContext.getReactively('destination_latlng'),
          reactiveContext.getReactively('distance')
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
          return Trips.find({});
        }
      });
    };
    createATrip = function (param, callback) {
      console.log(param);
      Meteor.call('createATrip', param, callback);
    };
    return {
      createATrip: createATrip,
      tripSearchSubscribe: tripSearchSubscribe
    };
  }])
