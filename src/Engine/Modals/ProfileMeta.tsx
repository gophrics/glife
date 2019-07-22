import { TripMeta } from './TripMeta';

export interface ProfileMeta {
    trips: TripMeta[];
    countriesVisited: string[]
    percentageWorldTravelled: number
    coverPicURL: string

    // Profile stuff
    profilePicURL: string
    profileId: string
    name: string
}