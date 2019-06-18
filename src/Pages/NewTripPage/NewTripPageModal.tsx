import { TripExplorePageModal } from "../TripExplorePage/TripExplorePageModal";
import { BlobSaveAndLoad } from '../../Engine/BlobSaveAndLoad';
import { Page } from '../../Modals/ApplicationEnums';

export class NewTripPageModal {

    data: TripExplorePageModal
    endTimestamp: number

    constructor() {
        this.data = new TripExplorePageModal()
        this.endTimestamp = 0

        var data = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.NEWTRIP])
        if(data != undefined)
            this.CopyConstructor(data)
    }

    CopyConstructor = (modal: NewTripPageModal) => {
        this.endTimestamp = modal.endTimestamp
    }
}