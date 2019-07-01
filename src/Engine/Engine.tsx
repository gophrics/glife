import { PublisherSubscriber } from './PublisherSubscriber'
import { ProfileModal } from './Modals/ProfileModal';
import { BlobProvider } from './Providers/BlobProvider';
import { Page } from '../Modals/ApplicationEnums';

export class Engine {
    PubSub: PublisherSubscriber;
    Data: ProfileModal
    constructor () {
        this.PubSub = new PublisherSubscriber()
        this.Data = BlobProvider.Instance.getBlobValue(Page[Page.PROFILE])
    }
}

export var Instance = new Engine()