import { ProfilePageModal } from "./ProfilePageModal";
import { TripExplorePageModal } from '../TripExplorePage/TripExplorePageModal';
import ImagePicker from 'react-native-image-crop-picker';

export class ProfilePageController {

    Modal: ProfilePageModal
    
    constructor() {
        this.Modal = new ProfilePageModal()
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
        this.Modal.name = name;
        this.Modal.Save()
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

    ClearAndUpdateProfileDataWithAllTrips = (trips: TripExplorePageModal[]) => {

        for(var trip of trips)
            this.Modal.countriesVisited.push.apply(this.Modal.countriesVisited, trip.countryCode)

        let x = (countries: string[]) => countries.filter((v,i) => countries.indexOf(v) === i)
        this.Modal.countriesVisited = x(this.Modal.countriesVisited); // Removing duplicates
        this.Modal.percentageWorldTravelled = Math.floor(this.Modal.countriesVisited.length*100/186)
        this.Modal.trips = trips
        this.Modal.trips.sort((a: TripExplorePageModal, b: TripExplorePageModal) => {
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        })
        
        this.Modal.Save()
    }

    UpdateProfileDataWithTrip (trip: TripExplorePageModal) : ProfilePageModal {

        this.Modal.countriesVisited.push.apply(this.Modal.countriesVisited, trip.countryCode)
        let x = (countries: string[]) => countries.filter((v,i) => countries.indexOf(v) === i)
        this.Modal.countriesVisited = x(this.Modal.countriesVisited); // Removing duplicates
        this.Modal.percentageWorldTravelled = Math.floor(this.Modal.countriesVisited.length*100/186)

        for(var _trip of this.Modal.trips) {
            if(_trip.tripId == trip.tripId){ _trip.CopyConstructor(trip); continue; }
        }

        this.Modal.trips.sort((a: TripExplorePageModal, b: TripExplorePageModal) => {
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        })
        
        this.Modal.Save()

        return this.Modal
    }

}