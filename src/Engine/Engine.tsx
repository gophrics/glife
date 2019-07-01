import { PublisherSubscriber } from './PublisherSubscriber'
import { ProfilePageModal } from '../Pages/ProfilePage/ProfilePageModal';
import { BlobProvider } from './Providers/BlobProvider';
import { Page } from '../Modals/ApplicationEnums';

export class Engine {
    PubSub: PublisherSubscriber;
    Data: ProfilePageModal
    constructor () {
        this.PubSub = new PublisherSubscriber()
        this.Data = BlobProvider.Instance.getBlobValue(Page[Page.PROFILE])
    }
}

export var Instance = new Engine()