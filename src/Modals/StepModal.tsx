import {Region} from 'react-native-maps';
import { TripUtils } from '../Engine/TripUtils';

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

    populateImages = async() => {
        for(var image of this.imageUris) {
            this.imageBase64.push(await TripUtils.PopulateImageBase64(image))
        }
        this.masterImageBase64 = await TripUtils.PopulateImageBase64(this.masterImageUri)
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

        //setInterval(this.checkAndFillData, Math.floor(Math.random()*1000));
    }
}