import { StepModal } from "./StepModal";
import Region from "./Region";
import { TripUtils } from "../Utils/TripUtils";

export class TripModal {
    tripId: number
    steps: StepModal[]
    location : Region
    tripName: string
    countryCode: string[]
    temperature : string
    daysOfTravel: number
    distanceTravelled : number
    activities: Array<string>
    startDate: string
    endDate: string
    masterPicURL: string
    _masterPicBase64: string
    public: boolean
    
    get masterPicBase64() {
        return TripUtils.PopulateImageBase64(this.masterPicURL)
    }

    constructor() {
        this.tripId = 0;
        this.steps = [];
        this.location = {} as Region
        this.temperature = ""
        this.daysOfTravel = 0
        this.distanceTravelled = 0
        this.activities = []
        this.startDate = ""
        this.endDate = ""
        this.tripName = ""
        this.countryCode = []
        this.masterPicURL = ""
        this._masterPicBase64 = ""
        this.public = false
        //Engine.Instance.PubSub.FunctionEveryTenSeconds.push(this.backgroundProcess)
    }

    CopyConstructor = (trip: any) => {
        this.tripId = trip.tripId;
        this.steps = trip.steps || trip.tripAsSteps;
        this.location = trip.location;
        this.temperature = trip.temperature;
        this.daysOfTravel = trip.daysOfTravel;
        this.distanceTravelled = trip.distanceTravelled;
        this.activities = trip.activities;
        this.startDate = trip.startDate;
        this.endDate = trip.endDate;
        this.tripName = trip.tripName || trip.title;
        this.countryCode = trip.countryCode;
        this.masterPicURL = trip.masterPicURL
        this._masterPicBase64 = trip.masterPicBase64
    }

    backgroundProcess = async() => {
        if(this.masterPicURL != "" && this._masterPicBase64 == "") {
            this._masterPicBase64 = await TripUtils.PopulateImageBase64(this.masterPicURL)
        }
    }

    populateAll = () => {
        this.populateMasterPic();
        this.populateDaysOfTravel();
        this.populateDistanceTravelled();
        this.populateDates();
        this.populateLocation();
        this.populateTemperature();
    }

    populateMasterPic = () => {
        this.masterPicURL = this.steps[this.steps.length-2].masterImageUri;
    }

    populateDaysOfTravel = () => {
        this.daysOfTravel =  Math.abs(Math.floor(this.steps[this.steps.length-1].endTimestamp/8.64e7) - Math.floor(this.steps[0].startTimestamp/8.64e7))
        this.daysOfTravel = this.daysOfTravel == 0 ? 1 : this.daysOfTravel;
    }

    populateDistanceTravelled = () => {
        this.distanceTravelled = this.steps[this.steps.length-1].distanceTravelled;
    }

    populateDates = () => {
        this.startDate = TripUtils.getDateFromTimestamp(this.steps[0].startTimestamp);
        this.endDate = TripUtils.getDateFromTimestamp(this.steps[this.steps.length - 1].endTimestamp);
    }

    populateLocation = () => {            
        // TODO: Fix this, country visited is not first step, first step is home
        this.location = {
            latitude: this.steps[1].meanLatitude,
            longitude: this.steps[1].meanLongitude,
            latitudeDelta: 0,
            longitudeDelta: 0
        } as Region
    }

    populateTemperature = () => {
        this.temperature = this.steps[1].temperature;
    }

    populateTitle = (countries: Array<string>, places: Array<string>) => {
        
        var tripName = "";
        if(countries.length == 1) {
            // Only home country, use places
            var index = 0;
            for(var place of places) {
                if(index == 0) {
                    tripName = place
                } else 
                tripName += ", " + place 
                if(index == 2) break;
                index++;
            }
        }
        else {
            var i = 0;
            for(var country of countries) {
                if(i == 0) tripName += country
                else tripName += ", " + country
                i++;
            } 
        }
        this.tripName = tripName
    }

}