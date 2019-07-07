import { StepModal } from "./StepModal";
import { Region } from "react-native-maps";
import { TripUtils } from "../Utils/TripUtils";
import AsyncStorage from "@react-native-community/async-storage";
import * as PhotoLibraryProcessor from '../Utils/PhotoLibraryProcessor';


export class TripModal {
    profileId: string
    tripId: string
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
    masterPicBase64: string
    public: boolean
    syncComplete: boolean

    async GetUploadData() {
        var data: any = {}
        data['tripId'] = this.tripId;
        data['tripName'] = this.tripName;
        data['profileId'] = this.profileId;
        data['steps'] = []
        for(var step of this.steps) {
            data['steps'].push(await step.GetUploadData())
        }
        data['public'] = this.public;
        data['masterPicBase64'] = await this.getMasterPicBase64();
        data['startDate'] = this.startDate;
        data['endDate'] = this.endDate;
        data['temperature'] = this.temperature;
        data['countryCode'] = this.countryCode;
        data['daysOfTravel'] = this.daysOfTravel;
        data['distanceTravelled'] = this.distanceTravelled;
        data['activities'] = this.activities;
        data['location'] = this.location;
        data['syncComplete'] = this.syncComplete;

        return data
    }
    
    getMasterPicBase64() {
        return AsyncStorage.getItem(this.masterPicURL)
    }

    async GenerateBase64Images() {
        var alreadyGenerated = await AsyncStorage.getItem(this.masterPicURL);
        if(alreadyGenerated == null) {
            var data = await PhotoLibraryProcessor.GetImageBase64(this.masterPicURL)
            if(data != "")
                await AsyncStorage.setItem(this.masterPicURL, data)
        }
        for(var _step of this.steps) {
            var step = new StepModal()
            step.CopyConstructor(_step)
            await step.GenerateBase64Images()
        }
    }

    constructor() {
        this.profileId = ""
        this.tripId = "";
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
        this.masterPicBase64 = ""
        this.public = false
        this.syncComplete = false
    }

    CopyConstructor = (trip: any) => {
        this.profileId = trip.profileId;
        this.tripId = trip.tripId;
        var steps = []
        for(var step of trip.steps || []) {
            var _s = new StepModal();
            _s.CopyConstructor(step)
            steps.push(_s)
        }
        this.steps = steps
        this.location = trip.location;
        this.temperature = trip.temperature;
        this.daysOfTravel = trip.daysOfTravel;
        this.distanceTravelled = trip.distanceTravelled;
        this.activities = trip.activities;
        this.startDate = trip.startDate;
        this.endDate = trip.endDate;
        this.tripName = trip.tripName || trip.title;
        this.countryCode = trip.countryCode;
        this.masterPicURL = trip.masterPicURL;
        this.masterPicBase64 = trip.masterPicBase64;
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
        } as Region;
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