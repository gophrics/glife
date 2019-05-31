import { StepModal } from "./StepModal";
import Region from "./Region";

export class TripModal {
    tripId: number
    tripAsSteps: StepModal[]
    location : Region
    title: string
    countryCode: string[]
    temperature : number
    daysOfTravel: number
    distanceTravelled : number
    activities: Array<string>
    startDate: string
    endDate: string
    
    constructor() {
        this.tripId = 0;
        this.tripAsSteps = [];
        this.location = {} as Region
        this.temperature = 0
        this.daysOfTravel = 0
        this.distanceTravelled = 0
        this.activities = []
        this.startDate = ""
        this.endDate = ""
        this.title = ""
        this.countryCode = []
    }
}