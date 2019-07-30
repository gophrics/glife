import { NativeModules } from 'react-native';
import { Region } from 'react-native-maps';

export class StepModal {
    profileId: string = ""
    tripId: string = ""
    stepId: number = 0
    stepName: string = ""
    meanLatitude: number = 0
    meanLongitude: number = 0
    startTimestamp: number = 0
    endTimestamp: number = 0
    masterImage: string = ""
    masterMarker: Region = {} as Region;
    distanceTravelled: number = 0
    description: string = ""
    temperature: number = 0

    get images() {
        return NativeModules.ExposedAPI.getStepData('images', this.profileId, this.tripId, this.stepId)
    }
}