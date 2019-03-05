import {CameraRoll} from 'react-native';
import { AnimatedRegion } from 'react-native-maps';

module.exports = {
    getPhotosFromLibrary: () => {
        return CameraRoll.getPhotos({ first: 1000000000 })
        .then((res) => {
          var locationList = [];
          var imageList = [];
          var timestampList = [];
          for(var image of res.edges) {
            var locationInfo = {
                region: {
                  latitude: 0, longitude: 0,
                  latitudeDelta: 0, longitudeDelta: 0
                }
            }
            if( image && image.node && image.node.location && 
                image.node.location.latitude && image.node.location.longitude) {
              locationInfo.region.latitude  = image.node.location.latitude;
              locationInfo.region.longitude = image.node.location.longitude;
              locationList.push(locationInfo);
              imageList.push(image.node.image.uri);
            }
            if( image && image.node && image.node.timestamp) {
                timestampList.push(image.node.timestamp);
            }
          }

          return {"locationInfo": locationList, "imageData": imageList, "timestampList": timestampList };
        });
      },

    triangulatePhotoLocationInfo: (locationInfos) => {
        var locationInfo = {
            region: {
              latitude: 0, longitude: 0,
              latitudeDelta: 0, longitudeDelta: 0
            }
        }
        var latitudeArray = [], longitudeArray = [];
        for(var location of locationInfos) {
            latitudeArray.push(location.region.latitude);
            longitudeArray.push(location.region.longitude);
        }

        // Sorting in ascending order
        latitudeArray.sort((a, b) => {
            return a < b ? -1 : 1;
        });
        longitudeArray.sort((a, b) => {
            return a < b ? -1 : 1;
        });

        latitude = latitudeArray.reduce((a, b) => {return a+b;},0)/latitudeArray.length;
        longitude = longitudeArray.reduce((a, b) => {return a+b;},0)/longitudeArray.length;

        locationInfo.region.latitude = latitude;
        locationInfo.region.longitude = longitude;
        locationInfo.region.latitudeDelta = 0;//latitudeArray[latitudeArray.length-1] - latitudeArray[0];
        locationInfo.region.longitudeDelta = 0;//longitudeArray[latitudeArray.length-1] - longitudeArray[0];

        return locationInfo;
    },

    getMarkers: (infos) => {
        var markers = [];
        for(var location of infos.locationInfo) {
            var loc = {
                title: "abc",
                description: ""
            }
            loc.latlong = {
                latitude: location.region.latitude,
                longitude: location.region.longitude
            };
            markers.push(loc);
        }

        return markers;
    }
}