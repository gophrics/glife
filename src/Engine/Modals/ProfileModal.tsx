import { TripModal } from '../Modals/TripModal';

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
        this.trips = [];
        for(var trip of profileData.trips) {
            var _t = new TripModal()
            _t.CopyConstructor(trip)
            this.trips.push(_t)
        }
        this.countriesVisited = profileData.countriesVisited;
        this.percentageWorldTravelled = profileData.percentageWorldTravelled;
        this.coverPicURL = profileData.coverPicURL;
        this.profilePicURL = profileData.profilePicURL;
        this.profileId = profileData.profileId;
        this.name = profileData.name;
    }
}