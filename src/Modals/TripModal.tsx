import { StepModal } from "./StepModal";
import Region from "./Region";
import { TravelUtils } from "../Utilities/TravelUtils";

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
    

    checkAndFillData = () => {
        if(this.tripAsSteps.length >=3 && this.title == "") {
            TravelUtils.getLocationFromCoordinates(this.location.latitude, this.location.longitude)
            .then((res) => {
                if(res.address) {
                    this.title = res.address.country
                    this.countryCode = res.address.country_code
                }
            })
        }
    }


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

        //setInterval(this.checkAndFillData, Math.floor(Math.random()*1000))
    }
}