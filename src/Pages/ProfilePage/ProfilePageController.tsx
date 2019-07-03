import { ProfileModal } from "../../Engine/Modals/ProfileModal";
import ImagePicker from 'react-native-image-crop-picker';
import * as Engine from '../../Engine/Engine'

export class ProfilePageController {

    Modal: ProfileModal
    
    constructor() {
        this.Modal = Engine.Instance.Modal
        this.loadModal()
    }

    loadModal = () => {
        if(Engine.Instance.engineLoaded) {
            this.Modal = Engine.Instance.Modal;
        } else {
            setTimeout(this.loadModal, 1000)
        }
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

    getName = () : string => {
        return this.Modal.name;
    }

    setName = (name: string) => {
        Engine.Instance.setName(name)
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