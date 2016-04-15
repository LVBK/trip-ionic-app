angular.module('app.services.imgInput', [])
  .factory('ImgInput', function ($q) {//inject service in there like that: (UserService)

      onLoad = function (reader, deferred, scope) {
        return function () {
          scope.$apply(function () {
            deferred.resolve(reader.result);
          });
        };
      };

      onError = function (reader, deferred, scope) {
        return function () {
          scope.$apply(function () {
            deferred.reject(reader.result);
          });
        };
      };

      onProgress = function (reader, scope) {
        return function (event) {
          scope.$broadcast("fileProgress",
            {
              total: event.total,
              loaded: event.loaded
            });
        };
      };

      getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
      };

      readAsDataUrl = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
      };
      return {
        readAsDataUrl: readAsDataUrl,
        getReader: getReader,
        onProgress: onProgress,
        onError: onError,
        onLoad: onLoad,
      };
    }
  )

