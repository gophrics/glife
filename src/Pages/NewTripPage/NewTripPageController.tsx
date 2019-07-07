import * as PhotoLibraryProcessor from '../../Engine/Utils/PhotoLibraryProcessor';
import { StepModal } from '../../Engine/Modals/StepModal'
import * as Engine from '../../Engine/Engine'
import { TripUtils } from '../../Engine/Utils/TripUtils';
import { TripModal } from "../../Engine/Modals/TripModal";

export class NewTripPageController {

    Modal: TripModal;

    constructor() {
        this.Modal = new TripModal()
    }

    setTripTitle = (title: string) => {
        this.Modal.tripName = title
    }

    checkPermissionToAccessPhotoLibrary = () : Promise<boolean> => {
        return PhotoLibraryProcessor.checkPhotoPermission()
    }

    validateInputs = () : boolean => {
        if(this.Modal.tripName == "") {
            return false
        }
        return true
    }

    processNewTrip = () : boolean => {

        if(!this.validateInputs()) return false

        var today: Date = new Date()

        this.Modal.startDate = today.getDay() + "-" + today.getMonth() + "-" + today.getFullYear()
        this.Modal.endDate = this.Modal.startDate;
        this.Modal.daysOfTravel = 0;

        var homeStep: StepModal = new StepModal();
        homeStep.startTimestamp = today.getTime()
        homeStep.endTimestamp = today.getTime() + 1 ; //milliseconds

        homeStep.meanLatitude = Engine.Instance.BlobProvider.homesForDataClustering[Math.floor(homeStep.startTimestamp / 8.64e7)].latitude
        homeStep.meanLongitude = Engine.Instance.BlobProvider.homesForDataClustering[Math.floor(homeStep.startTimestamp / 8.64e7)].longitude
        homeStep.location = "Home"
        homeStep.stepId = 1;

        this.Modal.steps.push(homeStep)

        homeStep = new StepModal()
        homeStep.startTimestamp = today.getTime() + 1;
        homeStep.endTimestamp = today.getTime() + 1;
        homeStep.meanLatitude = Engine.Instance.BlobProvider.homesForDataClustering[Math.floor(homeStep.startTimestamp / 8.64e7)].latitude
        homeStep.meanLongitude = Engine.Instance.BlobProvider.homesForDataClustering[Math.floor(homeStep.startTimestamp / 8.64e7)].longitude        
        homeStep.location = "Home"
        homeStep.stepId = 100000;
        this.Modal.steps.push(homeStep)

        this.Modal.tripId = TripUtils.GenerateTripId()

        Engine.Instance.UpdateProfileDataWithTrip(this.Modal)
        
        return true
    }

}