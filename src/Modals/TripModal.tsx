import { StepModal } from "./StepModal";
import Region from "./Region";

export class TripModal {
    tripId: number
    tripAsSteps: StepModal[]
    location : Region
    title: string
    countryCode: string[]
    temperature : string
    daysOfTravel: number
    distanceTravelled : number
    activities: Array<string>
    startDate: string
    endDate: string
    masterPicURL: string
    
    constructor() {
        this.tripId = 0;
        this.tripAsSteps = [];
        this.location = {} as Region
        this.temperature = ""
        this.daysOfTravel = 0
        this.distanceTravelled = 0
        this.activities = []
        this.startDate = ""
        this.endDate = ""
        this.title = ""
        this.countryCode = []
        this.masterPicURL = ""
    }
}