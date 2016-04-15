angular.module('app.services.general', [])
  .factory('GeneralService', function ($rootScope) {//inject service in there like that: (UserService)

    _getUserInfo = function () {
      return $rootScope.currentUser;
    };

    _checkEmailExist = function (email, callback) {
      Meteor.call('checkEmailExist', email, callback);
    };
    _getPubSelector = function (searchFields) {
      console.log("Get Selector", searchFields);
      if (!searchFields || searchFields.length === 0) {
        return {};
      }
      var searchCaseInsensitive = true;
      var searches = [];
      _.each(searchFields, function (field) {
        // Split and OR by whitespace
        field.searchString = field.searchString.trim();
        console.log(field.searchString);
        if (field.searchString !== "") {
          var m1 = {}, m2 = {};
          field.data = field.data.replace(/\[\w+\]/, "");
          // String search
          m1[field.data] = {$regex: field.searchString, $options: "i"};
          searches.push(m1);
          var numSearchString = Number(field);
          // Number search
          if (!isNaN(numSearchString)) {
            m2[field] = numSearchString;
            searches.push(m2);
          }
        }
      });
      console.log(searches);
      if (typeof searches !== 'undefined' && searches.length > 0)
        return _.extend({}, {$and: searches});
      return {};
    };
    _getServiceSelector = function (searchFields) {
      console.log("Get Selector", searchFields);
      if (!searchFields || searchFields.length === 0) {
        return {};
      }
      var searchCaseInsensitive = true;
      var searches = [];
      _.each(searchFields, function (field) {
        // Split and OR by whitespace
        if (field.searchValue) {
          var m1 = {}, m2 = {};
          field.data = field.data.replace(/\[\w+\]/, "");
          // String search
          m1[field.data] = field.searchValue;
          searches.push(m1);
          var numSearchString = Number(field);
          // Number search
          if (!isNaN(numSearchString)) {
            m2[field] = numSearchString;
            searches.push(m2);
          }
        }
      });
      console.log(searches);
      if (typeof searches !== 'undefined' && searches.length > 0)
        return _.extend({}, {$and: searches});
      return {};
    };
    _isUrl = function (string) {
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      return regexp.test(string);
    }
    _getImageUrl = function (imageId) {
      if (!imageId) {
        return "img/logo.png";
      }
      if (_isUrl(imageId)) {
        return imageId;
      }
      return __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL + "/cfs/files/images/" + imageId;
    };
    _getThumbnailUrl = function (imageId) {
      if (!imageId) {
        return "img/logo.png";
      }
      if (_isUrl(imageId)) {
        return imageId;
      }
      return __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL + "/cfs/files/images/" + imageId + "?store=thumbnail";
    };

    _userUploadProfileImage = function (file, callback) {
      Meteor.call("userUploadProfileImage", file, callback);
    };
    _userChangeProfile = function (profile, callback) {
      Meteor.call("userChangeProfile", profile, callback);
    };
    return {
      getUserInfo: _getUserInfo,
      checkEmailExist: _checkEmailExist,
      getPubSelector: _getPubSelector,
      getServiceSelector: _getServiceSelector,
      isUrl: _isUrl,
      getImageUrl: _getImageUrl,
      getThumbnailUrl: _getThumbnailUrl,
      userUploadProfileImage: _userUploadProfileImage,
      userChangeProfile: _userChangeProfile
    };
  })
