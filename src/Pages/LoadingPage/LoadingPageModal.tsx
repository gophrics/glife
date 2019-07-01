import { BlobProvider } from '../../Engine/Providers/BlobProvider'
import { Page, HomeDataModal } from '../../Modals/ApplicationEnums';

export class LoadingPageModal {
    homeData: Array<HomeDataModal>;

    constructor() {
        this.homeData = []
        
        var data = BlobProvider.Instance.getBlobValue(Page[Page.LOADING])
        if(data != undefined)
            this.CopyConstructor(data) 
    }

    CopyConstructor = (modal: LoadingPageModal) => {
        this.homeData = modal.homeData
    }

    Save() {
        BlobProvider.Instance.setBlobValue(Page[Page.LOADING], this)
    }
}
