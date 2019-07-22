import { NativeModules } from 'react-native';

export class StepModal {
    profileId: string = ""
    tripId: string = ""
    stepId: number = 0

    get stepName() {
        return NativeModules.getStepData('stepName', this.profileId, this.tripId, this.stepId)
    }

    get meanLatitude() {
        return NativeModules.getStepData('meanLatitude', this.profileId, this.tripId, this.stepId)
    }

    get meanLongitude() {
        return NativeModules.getStepData('meanLongitude', this.profileId, this.tripId, this.stepId)
    }

    get location() {
        return NativeModules.getStepData('location', this.profileId, this.tripId, this.stepId)
    }

    get startTimestamp() {
        return NativeModules.getStepData('startTimestamp', this.profileId, this.tripId, this.stepId)
    }

    get endTimestamp() {
        return NativeModules.getStepData('endTimestamp', this.profileId, this.tripId, this.stepId)
    }

    get images() {
        return NativeModules.getStepData('images', this.profileId, this.tripId, this.stepId)
    }

    get markers() {
        return NativeModules.getStepData('markers', this.profileId, this.tripId, this.stepId)
    }

    get masterImage() {
        return NativeModules.getStepData('masterImage', this.profileId, this.tripId, this.stepId)
    }

    get masterMarker() {
        return NativeModules.getStepData('masterMarker', this.profileId, this.tripId, this.stepId)
    }

    get distanceTravelled() {
        return NativeModules.getStepData('distanceTravelled', this.profileId, this.tripId, this.stepId)
    }

    get description() {
        return NativeModules.getStepData('description', this.profileId, this.tripId, this.stepId)
    }

    get temperature() {
        return NativeModules.getStepData('temperature', this.profileId, this.tripId, this.stepId)
    }

}