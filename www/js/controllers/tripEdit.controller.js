angular.module('app.tripEdit.controllers', [])

  .controller('tripEditCtrl', ['$scope', 'TripService', '$ionicPopup', '$ionicLoading',
      '$stateParams', '$ionicHistory', '$state',
      function ($scope, TripService, $ionicPopup, $ionicLoading,
                $stateParams, $ionicHistory, $state) {
        $scope.showAlert = function(value) {
          var myPopup = $ionicPopup.alert({
            template: '',
            title: value,
            scope: $scope,
            buttons: [
              {
                text: '<b>OK</b>',
                type: 'button-positive',
              },
            ]
          });
        };
        $scope.baggageSizeOptions = [
          {name: "Small", value: 'Small'},
          {name: "Medium", value: 'Medium'},
          {name: "Large", value: 'Large'}
        ];
        $scope.flexibleTimeOptions = [
          {name: "On time", value: 'On time'},
          {name: "+/- 5 minutes", value: '+/- 5 minutes'},
          {name: "+/- 10 minutes", value: '+/- 10 minutes'},
          {name: "+/- 15 minutes", value: '+/- 15 minutes'},
          {name: "+/- 30 minutes", value: '+/- 30 minutes'}
        ];
        $scope.flexibleDistanceOptions = [
          {name: "Unacceptable", value: 'Unacceptable'},
          {name: "3 kilometers", value: '3 kilometers'},
          {name: "5 kilometers", value: '5 kilometers'},
          {name: "10 kilometers", value: '10 kilometers'},
          {name: "15 kilometers", value: '15 kilometers'},
        ];
        $scope.data = {
          tripId: $stateParams.tripId,
          trip: null,
          user: null,
          callback: function(err, result){
            console.log(err, result);
          }
        };
        $scope.helpers({
          isDeparted: function () {
            if ($scope.getReactively('data.trip.startAt')) {
              if ($scope.data.trip.startAt < new Date()) {
                return true;
              }
            }
          },
          tripDeleted: function(){
            return $scope.getReactively('data.trip.isDeleted');
          },
          currentUser: function () {
            return Meteor.user();
          }
        });
        TripService.tripDetailSubscribe($scope.data, $scope);
        $scope.cancel = function () {
          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
          });
          if ($ionicHistory.viewHistory().backView) {
            $ionicHistory.goBack();
          } else {
            $state.go('menu.home');
          }
        }
        $scope.updateTrip = function(trip){
          $ionicLoading.show();
          var modifier = {
            note: trip.note,
            baggageSize: trip.baggageSize,
            flexibleTime: trip.flexibleTime,
            flexibleDistance: trip.flexibleDistance,
            pricePerSeat: trip.pricePerSeat,
          };
          TripService.updateTrip(trip._id, modifier, function(err, result){
            $ionicLoading.hide();
            if(err){
              $scope.showAlert(err.reason);
            } else {
              console.log("result", result)
              $scope.showAlert("Edit completed!");
            }
          })
        }
      }
    ]
  )
