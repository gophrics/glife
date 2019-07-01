import { TripModal } from '../Modals/TripModal';
import * as Engine from '../../Engine/Engine'
import { Page } from '../../Modals/ApplicationEnums';

export class ProfileModal {

    trips: TripModal[];
    countriesVisited: string[]
    percentageWorldTravelled: number
    coverPicURL: string

    // Profile stuff
    profilePicURL: string
    profileId: string
    name: string
    
    constructor() {
        this.trips = [];
        this.countriesVisited = []
        this.percentageWorldTravelled = 0
        this.coverPicURL = ""
        this.profilePicURL = ""
        this.profileId = ""
        this.name = ""
    }

    CopyConstructor = (profileData: ProfileModal) => {
        this.trips = profileData.trips;
        this.countriesVisited = profileData.countriesVisited;
        this.percentageWorldTravelled = profileData.percentageWorldTravelled;
        this.coverPicURL = profileData.coverPicURL;
        this.profilePicURL = profileData.profilePicURL;
        this.profileId = profileData.profileId;
        this.name = profileData.name;
    }
}