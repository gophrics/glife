import { AuthProvider } from "../../Engine/AuthProvider";
import { TripUtils } from "../../Engine/Utils/TripUtils";
import { TripExplorePageModal } from "../TripExplorePage/TripExplorePageModal";

export class SearchPageController {

    constructor() {

    }

    Search = async(text: string) => {
        var result = await TripUtils.Search(text)
        var returnresult: Array<TripExplorePageModal> = []

        for(var trip of result) {
            var t: TripExplorePageModal = new TripExplorePageModal()
            t.CopyConstructor(trip)
            t.populateAll()
            returnresult.push(t)
        }
        return returnresult
    }

    getAuthToken = () : string => {
        return AuthProvider.Token;
    }
}