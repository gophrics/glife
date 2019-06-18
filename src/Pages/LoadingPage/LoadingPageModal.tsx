import { BlobSaveAndLoad } from '../../Engine/BlobSaveAndLoad'
import { Page, HomeDataModal } from '../../Modals/ApplicationEnums';

export class LoadingPageModal {
    homeData: Array<HomeDataModal>;

    constructor() {
        this.homeData = []
        
        var data = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.LOADING])
        if(data != undefined)
            this.CopyConstructor(data) 
    }

    CopyConstructor = (modal: LoadingPageModal) => {
        this.homeData = modal.homeData
    }

    Save() {
        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.LOADING], this)
    }
}
