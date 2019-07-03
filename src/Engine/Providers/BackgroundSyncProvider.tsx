import { ProfileModal } from "../Modals/ProfileModal";
import {Md5} from 'ts-md5/dist/md5';
import { TripUtils } from '../Utils/TripUtils';
import { TripModal } from '../Modals/TripModal';
import AsyncStorage from "@react-native-community/async-storage";
import { Page } from "../../Modals/ApplicationEnums";
import * as Engine from "../Engine";

export class BackgroundSyncProvider {

    ProfileData: ProfileModal

    constructor() {
        this.ProfileData = new ProfileModal()
        this.Sync()
    }

    Sync = async() => {
        if(!Engine.Instance || !Engine.Instance.engineLoaded) {
            setTimeout(this.Sync, 1000)
            return
        }
        console.log("Syncing")
        this.ProfileData = Engine.Instance.Modal
        for(var _trip of this.ProfileData.trips) {
            var trip = new TripModal()
            trip.CopyConstructor(_trip)
            await trip.GenerateBase64Images()
            await this.TrimTripForUpload(trip)
            var serverHash = await TripUtils.GetTripCheckSumServer(trip)
            var clientHash = Md5.hashStr(trip.toString())
            if(serverHash.Hash != clientHash) {
                _trip.syncComplete = false
                console.log("Server hash: " + JSON.stringify(serverHash))
                console.log("Client hash: " + clientHash)
                console.log("Server client hash mismatch, uploading")
                console.log(trip)
                
                TripUtils.SaveTrip(trip)
            } else {
                _trip.syncComplete = true
            }
        }
        setTimeout(this.Sync, 1000)   
    }

    TrimTripForUpload = async(trip: TripModal) => {
        trip._masterPicBase64 = await AsyncStorage.getItem(trip.masterPicURL) || ""
        trip.masterPicURL = "";
    }

}