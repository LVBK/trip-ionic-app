angular.module('app.services.comments', [])
  .factory('CommentService', ['$meteor', '$reactive', function ($meteor, $reactive) {
    CommentsSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('comments', function () {
        return [
          reactiveContext.getReactively('tripId'),
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
        comments: function () {
          return Comments.find(
            {
              tripId: reactiveContext.getReactively('tripId')
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
          return Counts.get('comments');
        },
      });
    };
    comment = function (tripId, receiveUserId, content, callback) {
      Meteor.call('comment', tripId, receiveUserId, content, callback);
    };
    return {
      CommentsSubscribe: CommentsSubscribe,
      comment: comment,
    };
  }])
