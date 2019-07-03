import { ProfileModal } from "../Modals/ProfileModal";
import {Md5} from 'ts-md5/dist/md5';
import { TripUtils } from '../Utils/TripUtils';
import { TripModal } from '../Modals/TripModal';
import AsyncStorage from "@react-native-community/async-storage";
import { Page } from "../../Modals/ApplicationEnums";

export class BackgroundSyncProvider {

    ProfileData: ProfileModal

    constructor() {
        this.ProfileData = new ProfileModal
        this.Sync()
    }

    Sync = async() => {
        this.ProfileData = JSON.parse(await AsyncStorage.getItem(Page[Page.PROFILE]) || "{}")
        for(var trip of this.ProfileData.trips) {
            await trip.GenerateBase64Images()
            await this.TrimTripForUpload(trip)
            var serverHash = await TripUtils.GetTripCheckSumServer(trip)
            var clientHash = Md5.hashStr(trip.toString())
            if(serverHash.Hash != clientHash) {
                console.log("Server hash: " + JSON.stringify(serverHash))
                console.log("Client hash: " + clientHash)
                console.log("Server client hash mismatch, uploading")
                console.log(trip)
                
                TripUtils.SaveTrip(trip)
            }
        }   
    }

    TrimTripForUpload = async(trip: TripModal) => {
        trip._masterPicBase64 = await AsyncStorage.getItem(trip.masterPicURL) || ""
        trip.masterPicURL = "";
    }

}