import { NewTripPageModal } from "./NewTripPageModal";
import * as PhotoLibraryProcessor from '../../Engine/PhotoLibraryProcessor';
import { StepModal } from '../../Modals/StepModal'
import { BlobSaveAndLoad } from "../../Engine/BlobSaveAndLoad";
import { TripUtils } from '../../Engine/TripUtils';
import { ProfilePageController } from "../ProfilePage/ProfilePageController";

export class NewTripPageController {

    Modal: NewTripPageModal
    ProfilePageController: ProfilePageController;

    constructor() {
        this.Modal = new NewTripPageModal()
        this.ProfilePageController = new ProfilePageController()
    }

    setTripTitle = (title: string) => {
        this.Modal.data.title = title
    }

    checkPermissionToAccessPhotoLibrary = () : Promise<boolean> => {
        return PhotoLibraryProcessor.checkPhotoPermission()
    }

    validateInputs = () : boolean => {
        if(this.Modal.data.title == "") {
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
        homeStep.meanLatitude = BlobSaveAndLoad.Instance.homeData[Math.floor(homeStep.startTimestamp / 8.64e7)].latitude
        homeStep.meanLongitude = BlobSaveAndLoad.Instance.homeData[Math.floor(homeStep.startTimestamp / 8.64e7)].longitude
        homeStep.location = "Home"
        homeStep.id = 1;

        this.Modal.data.tripAsSteps.push(homeStep)

        homeStep = new StepModal()
        homeStep.startTimestamp = today.getTime() + 1;
        homeStep.endTimestamp = today.getTime() + 1;
        homeStep.meanLatitude = BlobSaveAndLoad.Instance.homeData[Math.floor(homeStep.startTimestamp / 8.64e7)].latitude
        homeStep.meanLongitude = BlobSaveAndLoad.Instance.homeData[Math.floor(homeStep.startTimestamp / 8.64e7)].longitude        
        homeStep.location = "Home"
        homeStep.id = 100000;
        this.Modal.data.tripAsSteps.push(homeStep)

        this.Modal.data.tripId = TripUtils.GenerateTripId()

        this.ProfilePageController.UpdateProfileDataWithTrip(this.Modal.data)
        
        return true
    }

}