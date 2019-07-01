import {Region} from 'react-native-maps';
import { TripUtils } from '../Engine/TripUtils';
import * as PubSub from '../Engine/PublisherSubscriber';

export class StepModal {

    stepId: number
    meanLatitude: number
    meanLongitude: number
    location: string
    startTimestamp: number
    endTimestamp: number
    timelineData: string[]
    imageUris: string[]
    imageBase64: string[]
    markers: Region[]
    masterImageUri: string
    masterImageBase64: string
    masterMarker: Region
    distanceTravelled: number
    description: string
    temperature: string
    backgroundProcessingComplete: boolean;

    backgroundProcess = async() => {
        if(this.masterImageUri != "" && this.masterImageBase64 == "") {
            this.masterImageBase64 = await TripUtils.PopulateImageBase64(this.masterImageUri)
            this.backgroundProcessingComplete = false;
        }
        var i = 0;
        for(var imageUri of this.imageUris) {
            if(i >= this.imageBase64.length) {
                this.imageBase64.push(await TripUtils.PopulateImageBase64(imageUri))
                this.backgroundProcessingComplete = false;
            }
            i++;
        }
        this.backgroundProcessingComplete = true;
    }

    constructor() {
        this.stepId = 0;
        this.meanLatitude = 0;
        this.meanLongitude = 0;
        this.location = "";
        this.startTimestamp = 0;
        this.endTimestamp = 0;
        this.imageUris = []
        this.imageBase64 = [];
        this.timelineData = [];
        this.markers = [];
        this.masterImageUri = "";
        this.masterMarker = { latitude: 0, longitude: 0 } as Region
        this.distanceTravelled = 0;
        this.description = "";
        this.temperature = "";
        this.masterImageBase64 = "";
        this.backgroundProcessingComplete = true;
        PubSub.Instance.FunctionEveryTenSeconds.push(this.backgroundProcess)
    }
}