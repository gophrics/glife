import { ProfileModal } from "../Modals/ProfileModal";
import {Md5} from 'ts-md5/dist/md5';
import { TripUtils } from '../Utils/TripUtils';
import * as Engine from "../Engine";
import { TripModal } from "../Modals/TripModal";
import BackgroundFetch from "react-native-background-fetch";

export class BackgroundSyncProvider {

    ProfileData: ProfileModal

    constructor() {
        this.ProfileData = new ProfileModal()
        this.BackgroundSync()
    }

    BackgroundSync = () => {
        // Configure it.
        BackgroundFetch.configure({
            minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
            // Android options
            stopOnTerminate: false,
            startOnBoot: true,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Default
            requiresCharging: false,      // Default
            requiresDeviceIdle: false,    // Default
            requiresBatteryNotLow: true, // Default
            requiresStorageNotLow: false  // Default
        }, async() => {
            console.log("[js] RNBackgroundFetch starting");
            await this.Sync()
            BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
        }, (error) => {
            console.log("[js] RNBackgroundFetch failed to start");
        });
    }

    Sync = async() => {
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
    }

}