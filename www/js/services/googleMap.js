angular.module('app.services.goooleMap', [])
  .factory('GoogleMapService', function () {//inject service in there like that: (UserService)

    geocodeAddress = function (geocoder, resultsMap, address, callback) {
      geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          var result = [];
          if (resultsMap) {
            resultsMap.setCenter(results[0].geometry.location);
          }
          //console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          result.push(results[0].geometry.location.lng());
          result.push(results[0].geometry.location.lat());
          callback(false, result);
        } else {
          callback('Geocode was not successful for the following reason: ' + status);
        }
      });
    };
    route = function (origin_place, destination_place, directionsService, callback) {
      if (!origin_place || !destination_place) {
        callback('Start or end location invalid');
      }
      directionsService.route({
        origin: origin_place,
        destination: destination_place,
        travelMode: google.maps.TravelMode.DRIVING
      }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          callback(false, response)
        } else {
          callback('Directions request failed');
        }
      });
    }
    return {
      geocodeAddress: geocodeAddress,
      route: route
    };
  })
