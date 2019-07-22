import { TripModal } from "../../Engine/Modals/TripModal";
import * as Engine from "../../Engine/Engine";

export class SearchPageController {

    constructor() {

    }

    IsLoggedIn = () => {
        return Engine.Instance.AppState.loggedIn
    }


    Search = async(text: string) => {
        var result = await TripUtils.Search(text)
        var returnresult: Array<TripModal> = []

        for(var trip of result) {
            returnresult.push(trip)
        }

        return returnresult
    }

    getAuthToken = () : string => {
        return AuthProvider.Token;
    }
}