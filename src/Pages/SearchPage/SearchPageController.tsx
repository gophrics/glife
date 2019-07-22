import { TripMeta } from "../../Engine/Modals/TripMeta";
import * as Engine from "../../Engine/Engine";

export class SearchPageController {

    constructor() {

    }

    IsLoggedIn = () => {
        return Engine.Instance.AppState.loggedIn
    }


    Search = async(text: string) => {
        var result = await TripUtils.Search(text)
        var returnresult: Array<TripMeta> = []

        for(var trip of result) {
            returnresult.push(trip)
        }

        return returnresult
    }

    getAuthToken = () : string => {
        return AuthProvider.Token;
    }
}