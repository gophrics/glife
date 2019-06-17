import { ProfilePageModal } from "./ProfilePageModal";
import ImagePicker from 'react-native-image-crop-picker';

export class ProfilePageController {

    Modal: ProfilePageModal
    constructor() {
        this.Modal = new ProfilePageModal
    }
    
    onProfilePicChange = (profilePicURL: string) => {
        this.Modal.profilePicURL = profilePicURL
    }

    onCoverPicChangePress = () => {
       return ImagePicker.openPicker({})
    }

    onCoverPicChange = (coverPicURL: string) => {
        this.Modal.coverPicURL = coverPicURL
    }

    getTrips = () => {
        return this.Modal.trips
    }

    getProfilePicURL = () => {
        return this.Modal.profilePicURL
    }

    getCoverPicURL = () => {
        return this.Modal.coverPicURL
    }

    getCountriesVisitedArray = () => {
        return this.Modal.countriesVisited
    }

    getNumberOfCountriesVisited = () => {
        return this.Modal.countriesVisited.length;
    }

    getPercentageWorldTravelled = () => {
        return this.Modal.percentageWorldTravelled;
    }
}