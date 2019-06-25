import { SocialUtils } from "../../Engine/SocialUtils";
import { AuthProvider } from "../../Engine/AuthProvider";

export class SearchPageController {

    constructor() {

    }

    searchString = async(text: string) => {
        var result = await SocialUtils.Search(text)
        // Complete the function
    }

    getAuthToken = () : string => {
        return AuthProvider.Token;
    }
}