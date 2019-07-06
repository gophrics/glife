import { ProfileModal } from "../Modals/ProfileModal";
import {Md5} from 'ts-md5/dist/md5';
import { TripUtils } from '../Utils/TripUtils';
import * as Engine from "../Engine";

export class BackgroundSyncProvider {

    ProfileData: ProfileModal

    constructor() {
        this.ProfileData = new ProfileModal()
        this.Sync()
    }

    Sync = async() => {
        if(!Engine.Instance || Engine.Instance.AppState.engineLoaded != Engine.EngineLoadStatus.Full) {
            setTimeout(this.Sync, 1000)
            return
        }
        try {
            console.log("Syncing")
            this.ProfileData = Engine.Instance.Modal
            for(var trip of this.ProfileData.trips) {
                await trip.GenerateBase64Images()
                var _trip = await trip.GetUploadData()
                var serverHash = await TripUtils.GetTripCheckSumServer(_trip)
                var clientHash = Md5.hashStr(_trip.toString())
                if(serverHash.Hash != clientHash) {
                    _trip.syncComplete = false
                    console.log(trip.tripName)
                    console.log("Server hash: " + JSON.stringify(serverHash))
                    console.log("Client hash: " + clientHash)
                    console.log("Server client hash mismatch, uploading")
                    
                    await TripUtils.SaveTrip(trip)
                } else {
                    _trip.syncComplete = true
                }
            }
        } catch (err) {
            console.log(err)
        }
        setTimeout(this.Sync, 1000)   
    }

}