import { TripModal } from '../../Engine/Modals/TripModal';
import { StepModal } from '../../Engine/Modals/StepModal';

import { Page } from '../../Modals/ApplicationEnums';
import * as Engine from "../../Engine/Engine";
import { NativeModules } from "react-native";

export class TripExplorePageController {
    NewStepId: number
    Modal: TripModal

    constructor() {
        this.NewStepId = 2;
        this.Modal = Engine.Instance.Cache[Page[Page.TRIPEXPLORE]] as TripModal
    }

    SetDescription = (text: string, stepId: number) => {
        NativeModules.setStepData('description', this.Modal.profileId, this.Modal.tripId, stepId)
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