import { SocialUtils } from "../../Engine/Utils/SocialUtils";
import { TripModal } from "../../Engine/Modals/TripModal";

export class FeedPageController {

    constructor() {

    }

    GetFeed = async(): Promise<Array<TripModal>> => {
        var feeds = await SocialUtils.GetFeed()
        return []
    }

    onTripPress = (tripModal: TripModal) => {

    }
}