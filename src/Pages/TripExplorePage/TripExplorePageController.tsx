import { TripModal } from "../../Engine/Modals/TripModal";
import { StepModal } from '../../Engine/Modals/StepModal';
import { Page } from '../../Modals/ApplicationEnums';
import { ProfilePageController } from "../ProfilePage/ProfilePageController";
import * as Engine from "../../Engine/Engine";
import { PublisherSubscriber } from '../../Engine/PublisherSubscriber'

export class TripExplorePageController {

    Modal: TripModal
    NewStepId: number
    ProfilePageController: ProfilePageController

    constructor() {
        this.NewStepId = 2;
        this.ProfilePageController = new ProfilePageController()
        this.Modal = new TripModal()
        this.Modal.CopyConstructor(PublisherSubscriber.Bus[Page[Page.TRIPEXPLORE]] as TripModal || {})
    }

    onNewStepPress = (step: StepModal) => {
        this.NewStepId = step.stepId + 1;
    }

    newStepDone = async (_step: StepModal | null) => {
        if (_step == null) {
            return;
        }

        //Right now, we're calcualting step based on images, and not overriding them
        _step.stepId = this.NewStepId;

        var trip: TripModal = this.Modal as TripModal
        trip.steps.push(_step);
        trip.steps.sort((a: StepModal, b: StepModal) => {
            return a.stepId - b.stepId;
        })

        trip = await Engine.Instance.PopulateTripModalData(trip.steps.slice(1, trip.steps.length - 1), trip.tripId)
        trip.tripName = this.Modal.tripName;

        this.Modal = Engine.Instance.UpdateProfileDataWithTrip(trip)
    }

    onPhotoModalDismiss = (step: StepModal) => {
        for (var _step of this.Modal.steps) {
            if (_step.stepId == step.stepId) {
                _step = step; break;
            }
        }
        Engine.Instance.BlobProvider.setBlobValue(Page[Page.STEPEXPLORE], this.Modal)
    }

    getFirstStep = () => {
        if (this.Modal.steps.length == 0)
            throw "No steps found"
        return this.Modal.steps[0]
    }

    getSteps = () => {
        if (this.Modal.steps == undefined || this.Modal.steps == null)
            throw "No steps found"
        return this.Modal.steps
    }
}