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
    numberOfPicturesTaken: number = 0
    
    get images() {
        return NativeModules.ExposedAPI.getStepData('images', this.profileId, this.tripId, this.stepId)
    }

    CopyConstructor(modal: any) {
        this.profileId = modal.profileId;
        this.tripId = modal.tripId;
        this.stepId = modal.stepId;
        this.stepName = modal.stepName;
        this.meanLatitude = modal.meanLatitude;
        this.meanLongitude = modal.meanLongitude;
        this.startTimestamp = modal.startTimestamp;
        this.endTimestamp = modal.endTimestamp;
        this.masterImage = modal.masterImage;
        this.masterMarker = modal.masterMarker;
        this.distanceTravelled = modal.distanceTravelled;
        this.description = modal.description;
        this.temperature = modal.temperature;
        this.numberOfPicturesTaken = modal.numberOfPicturesTaken;
    }
}