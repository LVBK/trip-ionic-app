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
        roadMapSearchData: function () {
          return RoadMaps.find(
            {
              $and: [
                {startAt: {$gte: new Date()}},
                {isDeleted: false}
              ]
            },
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
          reactiveContext.getReactively('roadMapId'),
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
        roadMap: function () {
          return RoadMaps.findOne({_id: reactiveContext.getReactively('roadMapId')})
        },
        trip: function () {
          var roadMap = RoadMaps.findOne({_id: reactiveContext.getReactively('roadMapId')});
          if (roadMap)
            return Trips.findOne({_id: roadMap.tripId});
        },
        user: function () {
          var roadMap = RoadMaps.findOne({_id: reactiveContext.getReactively('roadMapId')});
          if (roadMap)
            return Meteor.users.findOne({_id: roadMap.owner});
        },
        //feedbackCount: function () {
        //  return Counts.get('trip_detail');
        //},
      });
    };
    createATrip = function (param, callback) {
      Meteor.call('createATrip', param, callback);
    };
    bookSeats = function(roadMapId, totalSeats, callback){
      Meteor.call('bookSeats', roadMapId, totalSeats, callback);
    }
    return {
      createATrip: createATrip,
      tripSearchSubscribe: tripSearchSubscribe,
      tripDetailSubscribe: tripDetailSubscribe,
      bookSeats: bookSeats,
    };
  }])
