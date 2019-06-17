import { BlobSaveAndLoad } from '../../Engine/BlobSaveAndLoad'
import { Page, HomeDataModal } from '../../Modals/ApplicationEnums';

export class LoadingPageModal {
    homeData: Array<HomeDataModal>;

    constructor() {
        this.homeData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.LOADING])
    }

    Save() {
        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.LOADING], this)
    }
}
