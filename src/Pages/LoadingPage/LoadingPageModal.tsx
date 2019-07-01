import { Page, HomeDataModal } from '../../Modals/ApplicationEnums';
import * as Engine from '../../Engine/Engine'

export class LoadingPageModal {
    homeData: Array<HomeDataModal>;

    constructor() {
        this.homeData = []
        
        var data = Engine.Instance.BlobProvider.getBlobValue(Page[Page.LOADING])
        if(data != undefined)
            this.CopyConstructor(data) 
    }

    CopyConstructor = (modal: LoadingPageModal) => {
        this.homeData = modal.homeData
    }

    Save() {
        Engine.Instance.BlobProvider.setBlobValue(Page[Page.LOADING], this)
    }
}
