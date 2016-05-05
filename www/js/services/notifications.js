angular.module('app.services.notifications', [])
  .factory('NotificationService', ['$meteor', '$reactive', function ($meteor, $reactive) {
    notificationSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('notifications', function () {
        return [
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
        notifications: function () {
          return Notifications.find(
            {
              userId: Meteor.userId(),
            },
            {
              limit: parseInt(reactiveContext.getReactively('limit')),
            }
          ).fetch()
        },
        rowCount: function () {
          return Counts.get('notifications');
        },
      });
    };
    markAsRead = function (notificationId) {
      Meteor.call("markAsRead", notificationId);
    };
    markAllAsRead = function () {
      Meteor.call("markAllAsRead");
    };
    return {
      notificationSubscribe: notificationSubscribe,
      markAsRead: markAsRead,
      markAllAsRead: markAllAsRead,
    };
  }])
