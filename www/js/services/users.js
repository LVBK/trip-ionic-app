angular.module('app.services.users', [])
  .factory('UserService', ['$meteor', '$reactive', function ($meteor, $reactive) {
    userDetailSubscribe = function (context, $scope) {
      var reactiveContext = $reactive(context).attach($scope);
      var handler = reactiveContext.subscribe('user_detail', function () {
        return [
          reactiveContext.getReactively('userId'),
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
        user: function () {
          return Meteor.users.findOne({_id: reactiveContext.getReactively('userId')});
        },
      });
    };
    return {
      userDetailSubscribe: userDetailSubscribe,
    };
  }])
