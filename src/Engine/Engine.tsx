import { PublisherSubscriber } from './PublisherSubscriber'
import { ProfileModal } from './Modals/ProfileModal';
import { BlobProvider } from './Providers/BlobProvider';
import { Page } from '../Modals/ApplicationEnums';

export class Engine {
    PubSub: PublisherSubscriber;
    BlobProvider: BlobProvider;
    Data: ProfileModal

    constructor () {
        this.PubSub = new PublisherSubscriber()
        this.BlobProvider = new BlobProvider()
        this.Data = this.TryLoadingProfile()
    }


    TryLoadingProfile = () => {
        var data = this.BlobProvider.getBlobValue(Page[Page.PROFILE])
        if(data == undefined) {
            data = new ProfileModal()
        }
        return data
    }
}

export var Instance = new Engine()