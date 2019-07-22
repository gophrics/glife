import { StepModal } from "./StepModal";
import { Region } from "react-native-maps";

export interface TripModal {
    profileId: string
    tripId: string
    steps: StepModal[]
    location : Region
    tripName: string
    countryCode: string[]
    temperature : string
    daysOfTravel: number
    distanceTravelled : number
    activities: Array<string>
    startDate: string
    endDate: string
    masterPicURL: string
    masterPicBase64: string
    public: boolean
    syncComplete: boolean

}