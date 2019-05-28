import { TripModal } from './TripModal';
export class MapPhotoPageModal {
    trips: TripModal[];
    countriesVisited: string[]
    percentageWorldTravelled: number

    constructor(trips: TripModal[]) {
        this.trips = trips;
        this.countriesVisited = []
        this.percentageWorldTravelled = 0
    }
}