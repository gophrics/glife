import { StepModal } from "./StepModal";

export class TripModal {
    tripId: number
    tripAsSteps: StepModal[]
    location : string
    temperature : number
    daysOfTravel: number
    distanceTravelled : number
    activities: Array<string>
    startDate: string
    endDate: string
    
    constructor() {
        this.tripId = 0;
        this.tripAsSteps = [];
        this.location = ""
        this.temperature = 0
        this.daysOfTravel = 0
        this.distanceTravelled = 0
        this.activities = []
        this.startDate = ""
        this.endDate = ""
    }
}