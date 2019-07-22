import ImagePicker from 'react-native-image-crop-picker';
import { NativeModules } from "react-native";
import { Region } from "react-native-maps";

interface TripMeta{
    profileId: string
    tripId: string
    location : Region
    tripName: string
    countryCode: string[]
    temperature : string
    daysOfTravel: number
    distanceTravelled : number
    activities: Array<string>
    startDate: string
    endDate: string
    masterPic: string
    public: boolean
    syncComplete: boolean
}

interface ProfileMeta {
    trips: TripMeta[];
    countriesVisited: string[]
    percentageWorldTravelled: number
    coverPicURL: string

    // Profile stuff
    profilePicURL: string
    profileId: string
    name: string
}

export class ProfilePageController {
    
    Modal: ProfileMeta;

    constructor() {
        this.Modal = {} as ProfileMeta;
        this.loadModal()
    }

    loadModal = async() => {
        this.Modal = await NativeModules.getProfileMeta()
    }
    
    onProfilePicChange = (profilePicURL: string) => {
        NativeModules.setProfilePic(profilePicURL);
    }

    onCoverPicChangePress = () => {
       return ImagePicker.openPicker({})
    }

    onCoverPicChange = (coverPicURL: string) => {
        NativeModules.setCoverPic(coverPicURL)
    }
    
    getTrips = async() : Promise<Array<TripMeta>> => {
        return this.Modal.trips
    }

    getProfilePicURL = async() => {
        return this.Modal.profilePicURL;
    }

    getCoverPicURL = async() => {
        return this.Modal.coverPicURL;
    }

    getCountriesVisitedArray = () => {
        return this.Modal.countriesVisited;
    }

    getNumberOfCountriesVisited = () => {
        return this.Modal.countriesVisited.length;
    }

    getPercentageWorldTravelled = () => {
        return this.Modal.percentageWorldTravelled;
    }
}