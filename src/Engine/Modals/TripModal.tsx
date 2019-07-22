import { NativeModules } from "react-native";

export class TripModal {
    profileId: string = ""
    tripId: string = ""

    get steps() {
        return NativeModules.getTripData('steps', this.profileId, this.tripId)
    }

    get location() {
        return NativeModules.getTripData('location', this.profileId, this.tripId)
    }

    get tripName() {
        return NativeModules.getTripData('tripName', this.profileId, this.tripId)
    }

    get countryCode() {
        return NativeModules.getTripData('countryCode', this.profileId, this.tripId)
    }

    get temperature() {
        return NativeModules.getTripData('temperature', this.profileId, this.tripId)
    }

    get daysOfTravel() {
        return NativeModules.getTripData('daysOfTravel', this.profileId, this.tripId)
    }

    get distanceTravelled() {
        return NativeModules.getTripData('distanceTravelled', this.profileId, this.tripId)
    }

    get startDate() {
        return NativeModules.getTripData('startDate', this.profileId, this.tripId)
    }

    get endDate() {
        return NativeModules.getTripData('endDate', this.profileId, this.tripId)
    }

    get masterPic() {
        return NativeModules.getTripData('masterPic', this.profileId, this.tripId)
    }

    get public() {
        return NativeModules.getTripData('public', this.profileId, this.tripId)
    }
}