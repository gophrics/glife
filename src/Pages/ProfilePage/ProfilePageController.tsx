import { NativeModules } from "react-native";
import { ProfileModal } from '../../Engine/Modals/ProfileModal';
import { TripModal } from '../../Engine/Modals/TripModal';
import { Instance } from '../../Engine/Engine';
import * as Engine from '../../Engine/Engine';

export class ProfilePageController {
    
    Modal: ProfileModal = new ProfileModal();

    constructor() {
    }

    loadModal = async() => {
        this.Modal = Instance.Modal;
    }

    setName = async(name: string) => {
        NativeModules.ExposedAPI.setProfileData({"name": name }, 'name', await Engine.Instance.Modal.profileId)
    }
    
    onProfilePicChange = (profilePicURL: string) => {
        NativeModules.setProfilePic(profilePicURL);
    }

    onCoverPicChangePress = () => {
       //return ImagePicker.openPicker({})
    }

    onCoverPicChange = (coverPicURL: string) => {
        NativeModules.setCoverPic(coverPicURL)
    }
    
    getTrips = async() : Promise<Array<TripModal>> => {
        return await this.Modal.trips
    }

    getProfilePicURL = async() => {
        return await this.Modal.profilePicURL;
    }

    getCoverPicURL = async() => {
        return await this.Modal.coverPicURL;
    }

    getCountriesVisitedArray = async() => {
        return await this.Modal.countriesVisited;
    }

    getNumberOfCountriesVisited = async() => {
        return (await this.Modal.countriesVisited).length;
    }

    getPercentageWorldTravelled = async() => {
        return await this.Modal.percentageWorldTravelled;
    }
}