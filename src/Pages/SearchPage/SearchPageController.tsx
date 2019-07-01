import { AuthProvider } from "../../Engine/Providers/AuthProvider";
import { TripUtils } from "../../Engine/Utils/TripUtils";
import { TripModal } from "../../Engine/Modals/TripModal";

export class SearchPageController {

    constructor() {

    }

    Search = async(text: string) => {
        var result = await TripUtils.Search(text)
        var returnresult: Array<TripModal> = []

        for(var trip of result) {
            var t: TripModal = new TripModal()
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