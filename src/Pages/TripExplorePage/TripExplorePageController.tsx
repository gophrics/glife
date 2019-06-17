import { TripExplorePageModal } from "./TripExplorePageModal";
import { StepModal } from '../../Modals/StepModal';
import { TripUtils } from '../../Utilities/TripUtils';
import { BlobSaveAndLoad } from '../../Utilities/BlobSaveAndLoad';
import { Page } from '../../Modals/ApplicationEnums';

export class TripExplorePageController {

    Modal: TripExplorePageModal
    NewStepId: number

    constructor() {
        this.Modal = new TripExplorePageModal()
        this.NewStepId = 2;
    }

    onNewStepPress = (step: StepModal) => {
        this.NewStepId = step.id + 1;
    }

    newStepDone = async(_step: StepModal|null) => {
        if(_step == null) {
            return;
        }

        //Right now, we're calcualting step based on images, and not overriding them
        _step.id = this.NewStepId;

        var trip: TripExplorePageModal = this.Modal as TripExplorePageModal
        trip.tripAsSteps.push(_step);
        trip.tripAsSteps.sort((a: StepModal, b: StepModal) => {
            return a.id - b.id;
        })

        trip = await TripUtils.PopulateTripModalData(trip.tripAsSteps.slice(1, trip.tripAsSteps.length-1), trip.tripId)
        trip.title = this.Modal.title;

        var profileData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.PROFILE])
        profileData = TripUtils.UpdateProfileDataWithTrip(profileData, trip)
        
        profileData.trips.sort((a: TripExplorePageModal, b: TripExplorePageModal) => {
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        })

        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.PROFILE], profileData)
    }

    onPhotoModalDismiss = (step: StepModal) => {
        for(var _step of this.Modal.tripAsSteps) {
            if(_step.id == step.id) {
                _step = step; break;
            }
        }
        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.STEPEXPLORE], this.Modal)
    }

    getFirstStep = () => {
        if(this.Modal.tripAsSteps.length == 0) 
            throw "No steps found"
        return this.Modal.tripAsSteps[0]
    }

    getSteps = () => {
        if(this.Modal.tripAsSteps == undefined || this.Modal.tripAsSteps == null) 
            throw "No steps found"
        return this.Modal.tripAsSteps
    }
}