import { CameraRoll, GetPhotosParamType, Platform, ImageStore, ImageEditor, ImageCropData } from 'react-native';
import { ImageDataModal } from '../Modals/ImageDataModal';
import { Region } from 'react-native-maps';
import { ClusterModal } from '../Modals/ClusterModal';
import ImageResizer from 'react-native-image-resizer';
import * as RNFS from 'react-native-fs';

export async function getPhotosFromLibrary() : Promise<ImageDataModal[]> {
    var options = { first: 1000000000000000, assetType: "Photos"} as GetPhotosParamType;
    if(Platform.OS == 'ios') options.groupTypes = "All"
    return CameraRoll.getPhotos(options)
        .then(async (res) => {

            var imageDataList: Array<ImageDataModal> = [];
            for (var image of res.edges) {
                if (image && image.node && image.node.location &&
                    image.node.location.latitude && image.node.location.longitude) {
                    var imageData = convertImagetoImageModal(image)
                    imageDataList.push(imageData);
                }
            }

            return imageDataList;
        })
}

export function checkPhotoPermission() : Promise<boolean> {
    var options = { first: 1, assetType: "Photos"} as GetPhotosParamType;
    if(Platform.OS == 'ios') options.groupTypes = "All"
    return CameraRoll.getPhotos(options)
        .then((res) => {
            return true
        })
        .catch((error) => {
            return false
        })
}


export function convertImagetoImageModal(image: any) {
    var regionData = {
        latitude: image.node.location.latitude,
        longitude: image.node.location.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0
    } as Region
    var imageData = new ImageDataModal(regionData, image.node.image.uri, image.node.timestamp*1000);
    return imageData;
}

export function convertImageToCluster (images: Array<ImageDataModal>, endTimestamp: number) {
    var clusterData: Array<ClusterModal> = [];
    for(var i = 0; i < images.length; i++) {
        if(images[i].timestamp < endTimestamp) continue;
        clusterData.push({
            image: images[i].image,
            latitude: images[i].location.latitude, 
            longitude: images[i].location.longitude, 
            timestamp: images[i].timestamp,
            id: i} as ClusterModal )
    }

    return clusterData
}

export async function GetImageBase64(imageuri: string): Promise<string> {
    if(imageuri == undefined) return ""

    try {
        var res = await ImageResizer.createResizedImage(
            imageuri,
            512,
            512,
            'JPEG',
            100,
            0,
            "",
        )
    } catch(err) {
        return ""
    }
    var base64encodeddata = await RNFS.readFile(res.uri, 'base64')    
    return base64encodeddata
}