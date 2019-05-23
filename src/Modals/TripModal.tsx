import { StepModal } from "./StepModal";

export class TripModal {
    tripId: number
    tripAsSteps: StepModal[]

    constructor() {
        this.tripId = 0;
        this.tripAsSteps = [];
    }
}