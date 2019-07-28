import { NativeModules } from "react-native";

export class TripModal {
    profileId: string = ""
    tripId: string = ""
    tripName: string = "";
    countryCode: Array<string> = [];
    temperature: string = "";
    daysOfTravel: number = 0;
    distanceTravelled: number = 0;
    startDate: string = "";
    endDate: string = "";
    masterImage: string = "";
    public: boolean = false;

    constructor() {
    }

    CopyConstructor(modal: any) {
        this.profileId = modal.profileId;
        this.tripId = modal.tripId;
        this.tripName = modal.tripName;
        this.countryCode = modal.countryCode;
        this.temperature = modal.temperature;
        this.daysOfTravel = modal.daysOfTravel;
        this.distanceTravelled = modal.distanceTravelled;
        this.startDate = modal.startDate;
        this.endDate = modal.endDate;
        this.masterImage = modal.masterImage;
        this.public = modal.public;
    }

    get steps() {
        return NativeModules.ExposedAPI.getTripData('steps', this.profileId, this.tripId)
    }
}