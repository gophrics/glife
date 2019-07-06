import {Region} from 'react-native-maps';
import * as Engine from '../Engine'
import AsyncStorage from "@react-native-community/async-storage";
import * as PhotoLibraryProcessor from '../Utils/PhotoLibraryProcessor';

export class StepModal {
    stepId: number
    meanLatitude: number
    meanLongitude: number
    location: string
    startTimestamp: number
    endTimestamp: number
    timelineData: string[]
    imageUris: string[]
    _imageBase64: string[]
    markers: Region[]
    masterImageUri: string
    _masterImageBase64: string
    masterMarker: Region
    distanceTravelled: number
    description: string
    temperature: string

    get masterImageBase64(){
        return AsyncStorage.getItem(this.masterImageUri)
    }

    get imageBase64() {
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


    constructor() {
        this.stepId = 0;
        this.meanLatitude = 0;
        this.meanLongitude = 0;
        this.location = "";
        this.startTimestamp = 0;
        this.endTimestamp = 0;
        this.imageUris = []
        this._imageBase64 = [];
        this.timelineData = [];
        this.markers = [];
        this.masterImageUri = "";
        this.masterMarker = { latitude: 0, longitude: 0 } as Region
        this.distanceTravelled = 0;
        this.description = "";
        this.temperature = "";
        this._masterImageBase64 = "";
    }

    CopyConstructor = (step: any) => {
        this.stepId = step.stepId || "";
        this.meanLatitude = step.meanLatitude || 0;
        this.meanLongitude = step.meanLongitude || 0;
        this.location = step.location || "";
        this.startTimestamp = step.startTimestamp || 0;
        this.endTimestamp = step.endTimestamp || 0;
        this.imageUris = step.imageUris || [];
        this._imageBase64 = step._imageBase64 || [];
        this.timelineData = step.timelineData || [];
        this.markers = step.markers || [];
        this.masterImageUri = step.masterImageUri || "";
        this.masterMarker = step.masterMarker || {}
        this.distanceTravelled = step.distanceTravelled || 0;
        this.description = step.description || "";
        this.temperature = step.temperature || "0";
        this._masterImageBase64 = step._masterImageBase64 || "";
    }
}