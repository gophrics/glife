import { AuthProvider } from "../../Engine/AuthProvider";
import { TripUtils } from "../../Engine/TripUtils";

export class SearchPageController {

    constructor() {

    }

    Search = async(text: string) => {
        var result = await TripUtils.Search(text)
        // Complete the function
        return result
    }

    getAuthToken = () : string => {
        return AuthProvider.Token;
    }
}