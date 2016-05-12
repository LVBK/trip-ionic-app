angular.module('app.userProfile.controllers', [])

  .controller('userProfileCtrl', ['$scope', '$stateParams', 'GeneralService', 'UserService',
    'FeedbackService', '$timeout', '$ionicModal', '$ionicLoading', 'SosReportService', '$ionicPopup',
    function ($scope, $stateParams, GeneralService, UserService, FeedbackService, $timeout,
              $ionicModal, $ionicLoading, SosReportService, $ionicPopup) {
      $scope.reportOptions = [
        {name: "Scam behavior", value: 'scam'},
        {name: "Corrupt behavior", value: 'corrupt'},
        {name: "Impolite behavior", value: 'impolite'},
        {name: "Late arrival", value: 'late'},
      ];
      $scope.showAlert = function (value) {
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
      $scope.data = {
        userId: $stateParams.userId,
        user: null,
        feedbacks: [],
        limit: 5,
        rowCount: 0,
        noMoreItemAvailable: false,
        reportType: null,
        detailReason: null
      };
      $scope.getThumbnailUrl = function (imageId) {
        return GeneralService.getThumbnailUrl(imageId);
      };
      $scope.helpers({
        noItemAvailable: function () {
          if ($scope.getReactively('data.feedbacks')) {
            if ($scope.data.feedbacks.length > 0) {
              return false
            }
          }
          return true;
        },
        currentUser: function () {
          return Meteor.user();
        }
      });
      $scope.loadMore = function () {
        var remain = $scope.data.rowCount - $scope.data.limit;
        if (remain > 5) {
          $scope.data.limit += 5;
        } else if (remain > 0) {
          $scope.data.limit += remain;
        } else {
          $scope.data.noMoreItemAvailable = true;
        }
        $timeout(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 200);
      };
      UserService.userDetailSubscribe($scope.data, $scope);
      FeedbackService.feedbacksSubscribe($scope.data, $scope);

      $ionicModal.fromTemplateUrl('./../../templates/report.html', {
        scope: $scope,
        animation: 'slide-in-up',
      }).then(function (modal) {
        $scope.modal = modal;
      });

      $scope.openModal = function () {
        $scope.modal.show();
      };

      $scope.closeModal = function () {
        $scope.modal.hide();
      };

      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });

      // Execute action on hide modal
      $scope.$on('modal.hidden', function () {
        // Execute action
      });

      // Execute action on remove modal
      $scope.$on('modal.removed', function () {
        // Execute action
      });
      $scope.report = function (reportUserId, reportType, detailReason) {
        $ionicLoading.show();
        SosReportService.report(reportUserId, reportType, detailReason, function (err, result) {
          $ionicLoading.hide();
          if (err) {
            $scope.showAlert(err.reason);
          } else {
            $scope.closeModal();
            $scope.showAlert("Report successful!");
          }
        })
      };
    }])
