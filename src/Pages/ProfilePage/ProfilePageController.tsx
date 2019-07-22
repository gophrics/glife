import ImagePicker from 'react-native-image-crop-picker';
import { NativeModules } from "react-native";
import { ProfileModal } from '../../Engine/Modals/ProfileModal';
import { TripModal } from '../../Engine/Modals/TripModal';
import { Instance } from '../../Engine/Engine';

export class ProfilePageController {
    
    Modal: ProfileModal;

    constructor() {
        this.Modal = {} as ProfileModal;
        this.loadModal()
    }

    loadModal = async() => {
        this.Modal = Instance.Modal;
    }

    setName = (name: string) => {
        NativeModules.setName(name)
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
    
    getTrips = async() : Promise<Array<TripModal>> => {
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