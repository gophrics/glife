import {Region} from 'react-native-maps';
import { TripUtils } from '../Utils/TripUtils';

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

    get masterImageBase64() {
        return TripUtils.PopulateImageBase64(this.masterImageUri)
    }

    get imageBase64() {
        var retVal = []
        for(var imageUri of this.imageUris) {
            retVal.push(TripUtils.PopulateImageBase64(imageUri))
        }
        return retVal
    }

    backgroundProcess = async() => {
        if(this.masterImageUri != "" && this._masterImageBase64 == "") {
            this._masterImageBase64 = await TripUtils.PopulateImageBase64(this.masterImageUri)
            this.backgroundProcessingComplete = false;
        }
        var i = 0;
        for(var imageUri of this.imageUris) {
            if(i >= this._imageBase64.length) {
                this._imageBase64.push(await TripUtils.PopulateImageBase64(imageUri))
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
        //Engine.Instance.PubSub.FunctionEveryTenSeconds.push(this.backgroundProcess)
    }
}