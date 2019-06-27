
import { months, Page, HomeDataModal } from '../Modals/ApplicationEnums';
import { ClusterModal } from '../Modals/ClusterModal';
import { BlobSaveAndLoad } from './BlobSaveAndLoad';
import { AuthProvider } from './AuthProvider';
import * as Constants from "./Constants"
import { TripExplorePageModal } from '../Pages/TripExplorePage/TripExplorePageModal';
import { ProfilePageModal } from '../Pages/ProfilePage/ProfilePageModal';
import {Md5} from 'ts-md5/dist/md5';

const ServerURLWithoutEndingSlash = Constants.ServerURL + ":8082"

export class TripUtils {
    static TOTAL_TO_LOAD = 100;
    static FINISHED_LOADING = 0;
    static LAST_TRIP_PRESS = 0;
    
    static GenerateTripId = () : number => {
        return Math.floor(Math.random()*10000000)
    }

    static ExtendHomeDataToDate = () => {
        var today: Date = new Date()
        var endTimestamp = BlobSaveAndLoad.Instance.endTimestamp
        
        var homesDataForClustering = BlobSaveAndLoad.Instance.homeData;
        var dataToExtend = homesDataForClustering[endTimestamp]

        while(endTimestamp <= today.getTime()/8.64e7) {
            homesDataForClustering[endTimestamp] = dataToExtend;
            endTimestamp++
        }

        BlobSaveAndLoad.Instance.endTimestamp = endTimestamp;
        BlobSaveAndLoad.Instance.homeData = homesDataForClustering;
        BlobSaveAndLoad.Instance.saveEngineData()
    }

    static GenerateHomeData = async(homeInfo: Array<HomeDataModal>) : Promise<void> => {

        var homes: Array<{latitude: number, longitude: number, timestamp: number}> = [];
        var homesDataForClustering: {[key:number]: ClusterModal} = [];

        for(var element of homeInfo) {
            var res = await TripUtils.getCoordinatesFromLocation(element.name)
            res = res[0];
            homes.push({
                latitude: Number.parseFloat(res.lat),
                longitude: Number.parseFloat(res.lon),
                timestamp: (element.timestamp as number)
            })
        }

        var startTimestamp = Math.ceil((new Date()).getTime()/8.64e7);
        var endTimestamp = startTimestamp;
        homes.sort((a, b) => {
            return b.timestamp - a.timestamp;
        })

        for(var data of homes) {
            while(startTimestamp >= Math.floor(data.timestamp/8.64e7) && startTimestamp >= 0) {
                homesDataForClustering[startTimestamp] = data as ClusterModal;
                startTimestamp--;
            }
        }

        BlobSaveAndLoad.Instance.homeData = homesDataForClustering;
        BlobSaveAndLoad.Instance.startTimestamp = startTimestamp;
        BlobSaveAndLoad.Instance.endTimestamp = endTimestamp;
        BlobSaveAndLoad.Instance.saveEngineData()
    }

    static GetTotalToLoad = () => {
        return TripUtils.TOTAL_TO_LOAD
    }

    static GetFinishedLoading = () => {
        return TripUtils.FINISHED_LOADING
    }

    static getWeatherFromCoordinates(latitude: number, longitude: number): Promise<any> {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/searchweatherbylocation', {
            method: 'POST',
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude
            })
        })
        .then((res) => {
            return res.json()
        }).then((res) => {
            return res
        })
    }

    static Search(text: string): Promise<any> {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/search/' + text,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + AuthProvider.Token
            }
        })
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            console.log("Search Travel " + JSON.stringify(res))
            return res;
        })
        .catch((err) => {
            console.warn(err);
            throw err
        })
    }

    static getLocationFromCoordinates(latitude: number, longitude: number): Promise<any> {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/searchcoordinates', {
            method: 'POST',
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude
            })
        })
        .then((res) => {
            return res.json()
        }).then((res) => {
            return res
        })
    }

    static getCoordinatesFromLocation(location: string): Promise<any> {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/searchlocation', {
            method: 'POST',
            body: JSON.stringify({
                location: location
            })
        })
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            return res
        })
    }   

    static SaveTrip(trip: TripExplorePageModal): Promise<any> {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/savetrip', 
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + AuthProvider.Token
            },
            body: JSON.stringify(trip)
        })
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            return res
        })
    }

    static GetTripCheckSumServer(trip: TripExplorePageModal): Promise<any> {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/gettriphash',
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + AuthProvider.Token
            },
            body: JSON.stringify({
                "tripId": trip.tripId
            })
        })
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            console.log(res)
            return res
        })
        .catch((err) => {
            console.warn(err)
            throw err
        })
    }

    static UpdateTripBackground = async() => {
        var profilePageModal = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.PROFILE]) || {}
        var trips = profilePageModal.trips

        for(var trip of trips) {
            var serverHash = await TripUtils.GetTripCheckSumServer(trip)
            var clientHash = Md5.hashStr(trip)
            if(serverHash.Hash != clientHash) {
                console.log("Server hash: " + JSON.stringify(serverHash))
                console.log("Client hash: " + clientHash)
                console.log("Server client hash mismatch, uploading")
                console.log(trip)
                TripUtils.SaveTrip(trip)
            }
        }

    }

    static getDateFromTimestamp(timestamp: number): string {
        var date = new Date(timestamp)
        return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
    }
}