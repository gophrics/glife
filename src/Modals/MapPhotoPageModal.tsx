import { TripModal } from './TripModal';
export class MapPhotoPageModal {
    trips: TripModal[];
    countriesVisited: string[]
    percentageWorldTravelled: number
    coverPicURL: string

    // Profile stuff
    profilePicURL: string
    profileId: string
    
    constructor(trips: TripModal[]) {
        this.trips = trips;
        this.countriesVisited = []
        this.percentageWorldTravelled = 0
        this.coverPicURL = ""
        this.profilePicURL = ""
        this.profileId = ""
    }
}