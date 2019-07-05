import { AuthProvider } from "../../Engine/Providers/AuthProvider";
import { TripUtils } from "../../Engine/Utils/TripUtils";
import { TripModal } from "../../Engine/Modals/TripModal";

export class SearchPageController {

    constructor() {

    }

    GetTrip = async(trip: TripModal) => {
        var res = await TripUtils.GetTrip(trip.tripId, trip.profileId)
        console.log(res)
        var t = new TripModal()
        t.CopyConstructor(res)
        return t;
    }

    Search = async(text: string) => {
        var result = await TripUtils.Search(text)
        var returnresult: Array<TripModal> = []

        for(var trip of result) {
            var t: TripModal = new TripModal()
            t.CopyConstructor(trip)
            returnresult.push(t)
        }
        return returnresult
    }

    getAuthToken = () : string => {
        return AuthProvider.Token;
    }
}