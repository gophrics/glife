import { ProfileModal } from "../Modals/ProfileModal";
import {Md5} from 'ts-md5/dist/md5';
import { TripUtils } from '../Utils/TripUtils';
import * as Engine from "../Engine";
import { TripModal } from "../Modals/TripModal";

export class BackgroundSyncProvider {

    ProfileData: ProfileModal

    constructor() {
        this.ProfileData = new ProfileModal()
        this.Sync()
    }

    Sync = async() => {
        if(!Engine.Instance || Engine.Instance.AppState.engineLoaded != Engine.EngineLoadStatus.Full || !Engine.Instance.AppState.loggedIn) {
            setTimeout(this.Sync, 1000)
            return
        }
        try {
            this.ProfileData = Engine.Instance.Modal
            for(var trip of this.ProfileData.trips) {
                var t = new TripModal()
                t.CopyConstructor(trip)
                await t.GenerateBase64Images()
                var _trip = await t.GetUploadData()

                var serverHash = await TripUtils.GetTripCheckSumServer(trip)
                var clientHash = Md5.hashStr(JSON.stringify(_trip))
                if(serverHash.Hash != clientHash) {
                    console.log("Server hash " + serverHash.Hash)
                    console.log("Client hash " + clientHash)
                    trip.syncComplete = false        
                    console.log("Uploading trip ")
                    await TripUtils.SaveTrip(_trip)
                } else {
                    trip.syncComplete = true
                }
            }
            setTimeout(this.Sync, 1000)   
        } catch (err) {
            console.error(err)
            setTimeout(this.Sync, 1000)
        }
    }

}