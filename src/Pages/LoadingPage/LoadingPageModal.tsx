import { BlobSaveAndLoad } from '../../Engine/BlobSaveAndLoad'
import { Page, HomeDataModal } from '../../Modals/ApplicationEnums';

export class LoadingPageModal {
    homeData: Array<HomeDataModal>;
    constructor() {
        this.homeData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.LOADING])
    }
}
