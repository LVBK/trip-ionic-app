angular.module('app.services.feedbacks', [])
  .factory('FeedbackService', ['$meteor', '$reactive', function ($meteor, $reactive) {
    feedbacksSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('feedbacks', function () {
        return [
          reactiveContext.getReactively('userId'),
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
        feedbacks: function () {
          return Feedbacks.find(
            {
              to: reactiveContext.getReactively('userId')
            },
            {
              limit: parseInt(reactiveContext.getReactively('limit')),
              sort: {
                createdAt: -1
              }
            }
          ).fetch()
        },
        rowCount: function () {
          return Counts.get('feedbacks');
        },
      });
    };
    feedbackAlreadySubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('feedback_counter', function () {
        return [
          reactiveContext.getReactively('trip._id'),
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
        feedbackCount: function () {
          return Counts.get('feedback_counter');
        },
      });
    };
    feedback = function (tripId, rate, content, callback) {
      Meteor.call('feedback', tripId, rate, content, callback);
    };
    return {
      feedbacksSubscribe: feedbacksSubscribe,
      feedbackAlreadySubscribe: feedbackAlreadySubscribe,
      feedback: feedback,
    };
  }])
