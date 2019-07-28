import { NativeModules } from "react-native";

export class TripModal {
    profileId: string = ""
    tripId: string = ""

    get steps() {
        return NativeModules.ExposedAPI.getTripData('steps', this.profileId, this.tripId)
    }

    get location() {
        return NativeModules.ExposedAPI.getTripData('location', this.profileId, this.tripId)
    }

    get tripName() {
        return NativeModules.ExposedAPI.getTripData('tripName', this.profileId, this.tripId)
    }

    get countryCode() {
        return NativeModules.ExposedAPI.getTripData('countryCode', this.profileId, this.tripId)
    }

    get temperature() {
        return NativeModules.ExposedAPI.getTripData('temperature', this.profileId, this.tripId)
    }

    get daysOfTravel() {
        return NativeModules.ExposedAPI.getTripData('daysOfTravel', this.profileId, this.tripId)
    }

    get distanceTravelled() {
        return NativeModules.ExposedAPI.getTripData('distanceTravelled', this.profileId, this.tripId)
    }

    get startDate() {
        return NativeModules.ExposedAPI.getTripData('startDate', this.profileId, this.tripId)
    }

    get endDate() {
        return NativeModules.ExposedAPI.getTripData('endDate', this.profileId, this.tripId)
    }

    get masterImage() {
        return NativeModules.ExposedAPI.getTripData('masterImage', this.profileId, this.tripId)
    }

    get public() {
        return NativeModules.ExposedAPI.getTripData('public', this.profileId, this.tripId)
    }
}