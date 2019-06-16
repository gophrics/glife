import {Region} from 'react-native-maps';
import { TravelUtils } from '../Utilities/TravelUtils';

export class StepModal {

    id: number
    meanLatitude: number
    meanLongitude: number
    location: string
    startTimestamp: number
    endTimestamp: number
    timelineData: string[]
    imageUris: string[]
    markers: Region[]
    masterImageUri: string
    masterMarker: Region
    distanceTravelled: number
    description: string
    temperature: string

    checkAndFillData = () => {
        if(this.location == "" && (this.meanLatitude != 0 && this.meanLongitude != 0)) {
            return TravelUtils.getLocationFromCoordinates(this.meanLatitude, this.meanLongitude)
            .then((res) => {
                if(res.address)
                    this.location = res.address.county || res.address.state_district;
            })
        }
    }

    constructor() {
        this.id = 0;
        this.meanLatitude = 0;
        this.meanLongitude = 0;
        this.location = "";
        this.startTimestamp = 0;
        this.endTimestamp = 0;
        this.imageUris = []
        this.timelineData = [];
        this.markers = [];
        this.masterImageUri = "";
        this.masterMarker = { latitude: 0, longitude: 0 } as Region
        this.distanceTravelled = 0;
        this.description = "";
        this.temperature = "";

        //setInterval(this.checkAndFillData, Math.floor(Math.random()*1000));
    }
}