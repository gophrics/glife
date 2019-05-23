import {Image} from 'react-native';

export class StepModal {
    meanLatitude: number
    meanLongitude: number
    startTimestamp: number
    endTimestamp: number
    timelineData: string[]
    images: Image[]

    constructor() {
        this.meanLatitude = 0;
        this.meanLongitude = 0;
        this.startTimestamp = 0;
        this.endTimestamp = 0;
        this.images = []
        this.timelineData = [];
    }
}