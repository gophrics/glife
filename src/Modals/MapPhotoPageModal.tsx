import { TripModal } from './TripModal';
export class MapPhotoPageModal {
    trips: TripModal[];
    countriesVisited: string[]
    percentageWorldTravelled: number
    coverPicURL: string
    
    constructor(trips: TripModal[]) {
        this.trips = trips;
        this.countriesVisited = []
        this.percentageWorldTravelled = 0
        this.coverPicURL = ""
    }
}