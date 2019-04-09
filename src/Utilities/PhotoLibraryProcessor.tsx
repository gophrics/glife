import { CameraRoll } from 'react-native';
import ImageDataModal from '../Modals/ImageDataModal';
import Region from '../Modals/Region';

export function getPhotosFromLibrary() {
    return CameraRoll.getPhotos({ first: 1000000000 })
        .then((res) => {
            
            var imageDataList: Array<ImageDataModal> = [];
            for (var image of res.edges) {
                var regionData: Region;
                var imageData: ImageDataModal;

                if (image && image.node && image.node.location &&
                    image.node.location.latitude && image.node.location.longitude) {
                    
                    regionData = new Region(image.node.location.latitude, image.node.location.longitude, 0, 0);
                    imageData = new ImageDataModal(regionData, image.node.image.uri, image.node.timestamp*1000);
                    imageDataList.push(imageData);
                }
            }

            return imageDataList;
        });
}


export function getMarkers(imageDataArray: Array<ImageDataModal>): Array<Region> {
    var markers: Array<Region> = [];
    for (var imageData of imageDataArray) {
        markers.push(imageData.location);
    }
    return markers;
}

export function getTimelineData(imageDataArray: Array<ImageDataModal>) : Array<number> {
    var timelineData: Array<number> = [];
    for (var imageData of imageDataArray) {
        timelineData.push(imageData.timestamp);
    }
    return timelineData;
}

export function getImageUriArray(imageDataArray: Array<ImageDataModal>) : Array<any> {
    var imageUriArray: Array<number> = [];
    for (var imageData of imageDataArray) {
        imageUriArray.push(imageData.image);
    }
    return imageUriArray;
}

export function triangulatePhotoLocationInfo(regionInfos: Array<Region>): Region {

    var latitudeArray: Array<number> = [];
    var longitudeArray: Array<number> = [];

    for (var region of regionInfos) {
        latitudeArray.push(region.latitude);
        longitudeArray.push(region.longitude);
    }

    // Sorting in ascending order
    latitudeArray.sort((a, b) => {
        return a < b ? -1 : 1;
    });
    longitudeArray.sort((a, b) => {
        return a < b ? -1 : 1;
    });

    var triangulatedLocation: Region = new Region(
        latitudeArray.reduce((a, b) => { return a + b; }, 0) / latitudeArray.length,
        longitudeArray.reduce((a, b) => { return a + b; }, 0) / longitudeArray.length,
        0,
        0
    );

    return triangulatedLocation;
}