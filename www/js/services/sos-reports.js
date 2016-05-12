angular.module('app.services.sosReports', [])
  .factory('SosReportService', ['$meteor', '$reactive', function ($meteor, $reactive) {
    sos = function (checkInTicketId, currentLocation, callback) {
      Meteor.call('sos', checkInTicketId, currentLocation, callback);
    };
    report = function (reportUserId, reportType, detailReason, callback) {
      Meteor.call('report', reportUserId, reportType, detailReason, callback);
    };
    return {
      sos: sos,
      report: report
    };
  }])
