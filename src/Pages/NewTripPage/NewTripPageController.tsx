import { NewTripPageModal } from "./NewTripPageModal";
import * as PhotoLibraryProcessor from '../../Engine/Utils/PhotoLibraryProcessor';
import { StepModal } from '../../Engine/Modals/StepModal'
import * as Engine from '../../Engine/Engine'
import { TripUtils } from '../../Engine/Utils/TripUtils';
import { ProfilePageController } from "../ProfilePage/ProfilePageController";

export class NewTripPageController {

    Modal: NewTripPageModal

    constructor() {
        this.Modal = new NewTripPageModal()
    }

    setTripTitle = (title: string) => {
        this.Modal.data.tripName = title
    }

    checkPermissionToAccessPhotoLibrary = () : Promise<boolean> => {
        return PhotoLibraryProcessor.checkPhotoPermission()
    }

    validateInputs = () : boolean => {
        if(this.Modal.data.tripName == "") {
            return false
        }
        return true
    }

    processNewTrip = () : boolean => {

        if(!this.validateInputs()) return false

        var today: Date = new Date()

        this.Modal.data.startDate = today.getDay() + "-" + today.getMonth() + "-" + today.getFullYear()
        this.Modal.data.endDate = this.Modal.data.startDate;
        this.Modal.data.daysOfTravel = 0;

        var homeStep: StepModal = new StepModal();
        homeStep.startTimestamp = today.getTime()
        homeStep.endTimestamp = today.getTime() + 1 ; //milliseconds

        homeStep.meanLatitude = Engine.Instance.BlobProvider.homesForDataClustering[Math.floor(homeStep.startTimestamp / 8.64e7)].latitude
        homeStep.meanLongitude = Engine.Instance.BlobProvider.homesForDataClustering[Math.floor(homeStep.startTimestamp / 8.64e7)].longitude
        homeStep.location = "Home"
        homeStep.stepId = 1;

        this.Modal.data.steps.push(homeStep)

        homeStep = new StepModal()
        homeStep.startTimestamp = today.getTime() + 1;
        homeStep.endTimestamp = today.getTime() + 1;
        homeStep.meanLatitude = Engine.Instance.BlobProvider.homesForDataClustering[Math.floor(homeStep.startTimestamp / 8.64e7)].latitude
        homeStep.meanLongitude = Engine.Instance.BlobProvider.homesForDataClustering[Math.floor(homeStep.startTimestamp / 8.64e7)].longitude        
        homeStep.location = "Home"
        homeStep.stepId = 100000;
        this.Modal.data.steps.push(homeStep)

        this.Modal.data.tripId = TripUtils.GenerateTripId()

        Engine.Instance.UpdateProfileDataWithTrip(this.Modal.data)
        
        return true
    }

}