import {Region} from 'react-native-maps';
import AsyncStorage from "@react-native-community/async-storage";
import * as PhotoLibraryProcessor from '../Utils/PhotoLibraryProcessor';

export class StepModal {
    stepId: number
    stepName: string
    meanLatitude: number
    meanLongitude: number
    location: string
    startTimestamp: number
    endTimestamp: number
    imageUris: string[]
    markers: Region[]
    masterImageUri: string
    masterMarker: Region
    distanceTravelled: number
    description: string
    temperature: string
    masterImageBase64: string
    imageBase64: string[];

    getMasterImageBase64() {
        return AsyncStorage.getItem(this.masterImageUri)
    }

    getImageBase64() {
        var promiseArray = [];
        for(var image of this.imageUris) {
            promiseArray.push(AsyncStorage.getItem(image))
        }
        return promiseArray
    }

    async GenerateBase64Images() {
        for(var image of this.imageUris) {
            var alreadyGenerated = await AsyncStorage.getItem(image)
            if(alreadyGenerated == null) {
                var data = await PhotoLibraryProcessor.GetImageBase64(image)
                if(data != "")
                    await AsyncStorage.setItem(image, data)
            }
        }
        var alreadyGenerated = await AsyncStorage.getItem(this.masterImageUri);
        if(alreadyGenerated == null) {
            var data = await PhotoLibraryProcessor.GetImageBase64(this.masterImageUri)
            if(data != "")
                await AsyncStorage.setItem(this.masterImageUri, data)
        }
    }

    async GetUploadData() {
        var data: any = {}
        data['stepId'] = this.stepId;
        data['stepName'] = this.stepName;
        data['imageBase64'] = [];
        for(var image of this.getImageBase64()) {
            data['imageBase64'].push(await image)
        }
        data['masterImageBase64'] = await this.getMasterImageBase64();
        data['masterMarker'] = this.masterMarker;
        data['markers'] = this.markers;
        data['meanLatitude'] = this.meanLatitude;
        data['meanLongitude'] = this.meanLongitude;
        data['location'] = this.location;
        data['startTimestamp'] = this.startTimestamp;
        data['endTimestamp'] = this.endTimestamp;
        data['distanceTravelled'] = this.distanceTravelled;
        data['description'] = this.description;
        data['temperature'] = this.temperature;

        return data;
    }

    constructor() {
        this.stepId = 0;
        this.meanLatitude = 0;
        this.meanLongitude = 0;
        this.location = "";
        this.startTimestamp = 0;
        this.endTimestamp = 0;
        this.imageUris = []
        this.markers = [];
        this.masterImageUri = "";
        this.masterMarker = { latitude: 0, longitude: 0 } as Region
        this.distanceTravelled = 0;
        this.description = "";
        this.temperature = "";
        this.stepName = "";
        this.masterImageBase64 = "";
        this.imageBase64 = [];
    }

    CopyConstructor = (step: any) => {
        this.stepId = step.stepId;
        this.meanLatitude = step.meanLatitude;
        this.meanLongitude = step.meanLongitude;
        this.location = step.location;
        this.startTimestamp = step.startTimestamp;
        this.endTimestamp = step.endTimestamp;v
        this.imageUris = step.imageUris;
        this.imageBase64 = step.imageBase64;
        this.markers = step.markers;
        this.masterImageUri = step.masterImageUri;
        this.masterMarker = step.masterMarker;
        this.distanceTravelled = step.distanceTravelled;
        this.description = step.description;
        this.temperature = step.temperature;
        this.masterImageBase64 = step.masterImageBase64;
    }
}