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
    backgroundProcessingComplete: boolean;

    get masterImageBase64(){
        return AsyncStorage.getItem(this.masterImageUri)
    }

    get imageBase64() {
        return AsyncStorage.getItem(this.imageUris.toString())
    }

    async GenerateBase64Images() {
        for(var image of this.imageUris) {
            var alreadyGenerated = await AsyncStorage.getItem(image)
            if(alreadyGenerated == null) {
                var data = await PhotoLibraryProcessor.GetImageBase64(image)
                await AsyncStorage.setItem(image, data)
            }
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
        this.backgroundProcessingComplete = true;
    }
}