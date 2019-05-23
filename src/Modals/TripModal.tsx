import { StepModal } from "./StepModal";

export class TripModal {
    tripId: number
    tripAsSteps: StepModal[]
    location? : string
    temperature? : number
    daysOfTravel?: number
    distanceTravelled? : number
    activities?: Array<string>
    startDate?: string
    endDate?: string
    
    constructor() {
        this.tripId = 0;
        this.tripAsSteps = [];
    }
}