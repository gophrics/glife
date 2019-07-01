import { SocialUtils } from "../../Engine/Utils/SocialUtils";
import { TripExplorePageModal } from "../TripExplorePage/TripExplorePageModal";

export class FeedPageController {

    constructor() {

    }

    GetFeed = async(): Promise<Array<TripExplorePageModal>> => {
        var feeds = await SocialUtils.GetFeed()
        return []
    }

    onTripPress = (tripModal: TripExplorePageModal) => {

    }
}