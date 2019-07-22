import ImagePicker from 'react-native-image-crop-picker';
import { NativeModules } from "react-native";
import { ProfileMeta } from '../../Engine/Modals/ProfileMeta';
import { TripMeta } from '../../Engine/Modals/TripMeta';

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