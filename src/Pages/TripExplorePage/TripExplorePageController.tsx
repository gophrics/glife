import { StepModal } from '../../Engine/Modals/StepModal';
import { Page } from '../../Modals/ApplicationEnums';
import { ProfilePageController } from "../ProfilePage/ProfilePageController";
import * as Engine from "../../Engine/Engine";
import { NativeModules } from "react-native";

export class TripExplorePageController {
    NewStepId: number

    constructor() {
        this.NewStepId = 2;
    }

    onNewStepPress = (step: StepModal) => {
        this.NewStepId = step.stepId + 1;
    }

    newStepDone = async (_step: StepModal | null) => {
        if (_step == null) {
            return;
        }

        NativeModules.newStep(_step)
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