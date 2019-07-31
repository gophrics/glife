import { NativeModules } from "react-native";
import { ProfileModal } from '../../Engine/Modals/ProfileModal';
import { TripModal } from '../../Engine/Modals/TripModal';
import * as Engine from '../../Engine/Engine';

export class ProfilePageController {
    
    Modal: ProfileModal = new ProfileModal();

    loadModal = async() => {
        this.Modal.CopyConstructor(await NativeModules.ExposedAPI.getProfileData('all', 'randomGeneratedId'))
    }
    
    onProfilePicChange = (profilePicURL: string) => {
        NativeModules.setProfilePic(profilePicURL);
    }

    onCoverPicChangePress = () => {
       //return ImagePicker.openPicker({})
    }

    onCoverPicChange = (coverPicURL: string) => {
        NativeModules.ExposedAPI.setProfileData('coverPicURL', coverPicURL)
    }
    
    getTrips = async() : Promise<Array<TripModal>> => {
        let trips = await this.Modal.trips
        var result: Array<TripModal> = [];
        for(let trip of trips) {
            var _t = new TripModal()
            _t.CopyConstructor(trip)
            result.push(_t)
        }
        return result
    }

    getProfilePicURL = () => {
        return this.Modal.profilePicURL;
    }

    getCoverPicURL = () => {
        return this.Modal.coverPicURL;
    }

    getCountriesVisitedArray = () => {
        return this.Modal.countriesVisited;
    }

    getNumberOfCountriesVisited = () => {
        return (this.Modal.countriesVisited || []).length;
    }

    getPercentageWorldTravelled = () => {
        return this.Modal.percentageWorldTravelled;
    }
}