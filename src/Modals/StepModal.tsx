import {Image} from 'react-native';
import {Region} from 'react-native-maps';

export class StepModal {

    id: number
    meanLatitude: number
    meanLongitude: number
    startTimestamp: number
    endTimestamp: number
    timelineData: string[]
    imageUris: string[]
    markers: Region[]
    masterImageUri: string
    masterMarker: Region

    constructor() {
        this.id = 0;
        this.meanLatitude = 0;
        this.meanLongitude = 0;
        this.startTimestamp = 0;
        this.endTimestamp = 0;
        this.imageUris = []
        this.timelineData = [];
        this.markers = [];
        this.masterImageUri = "";
        this.masterMarker = {} as Region
    }
}