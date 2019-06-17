import { ProfilePageModal } from "./ProfilePageModal";
import { TripExplorePageModal } from '../TripExplorePage/TripExplorePageModal';
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

    setTrips = (trips: TripExplorePageModal[]) => {
        this.Modal.trips = trips
        this.Modal.Save()
    }

    UpdateProfileDataWithTrip (profileData: ProfilePageModal, trip: TripExplorePageModal) : ProfilePageModal {

        profileData.countriesVisited.push.apply(profileData.countriesVisited, trip.countryCode)
        let x = (countries: string[]) => countries.filter((v,i) => countries.indexOf(v) === i)
        profileData.countriesVisited = x(profileData.countriesVisited); // Removing duplicates
        profileData.percentageWorldTravelled = Math.floor(profileData.countriesVisited.length*100/186)

        var trips: TripExplorePageModal[] = []
        for(var _trip of profileData.trips) {
            if(_trip.tripId == trip.tripId){ trips.push(trip); continue; }
            trips.push(_trip)
        }

        profileData.trips = trips

        return profileData
    }

}