
import { months, Page, HomeDataModal } from '../../Modals/ApplicationEnums';
import { ClusterModal } from '../Modals/ClusterModal';
import { AuthProvider } from '../Providers/AuthProvider';
import * as Constants from "../Constants"
import { TripModal } from '../Modals/TripModal';
import * as Engine from '../Engine';

const ServerURLWithoutEndingSlash = Constants.ServerURL + ":8082"

export class TripUtils {
    static TOTAL_TO_LOAD = 100;
    static FINISHED_LOADING = 0;
    static LAST_TRIP_PRESS = 0;
    
    static GenerateTripId = () : string => {
        return Math.floor(Math.random()*10000000).toString()
    }

    static ExtendHomeDataToDate = () => {
        var today: Date = new Date()
        var endTimestamp = Engine.Instance.BlobProvider.endTimestamp
        
        var homesDataForClustering = Engine.Instance.BlobProvider.homesForDataClustering;
        var dataToExtend = homesDataForClustering[endTimestamp]

        while(endTimestamp <= today.getTime()/8.64e7) {
            homesDataForClustering[endTimestamp] = dataToExtend;
            endTimestamp++
        }

        Engine.Instance.BlobProvider.endTimestamp = endTimestamp;
        Engine.Instance.BlobProvider.homesForDataClustering = homesDataForClustering;
        Engine.Instance.BlobProvider.saveEngineData()
    }

    static GenerateHomeData = async(homeInfo: Array<HomeDataModal>) : Promise<any> => {

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

        return {
            "homeData": homesDataForClustering,
            "startTimestamp": startTimestamp,
            "endTimestamp": endTimestamp
        }
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
            try {
                return res.json()
            } catch(err) {
                throw res
            }
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
            try {
                return res.json()
            } catch(err) {
                throw res
            }
        })
        .then((res) => {
            console.log("Search Travel " + JSON.stringify(res))
            return res;
        })
        .catch((err) => {
            console.log(err);
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
            try {
                return res.json()
            } catch(err) {
                throw res
            }
        })
        .then((res) => {
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
            try {
                return res.json()
            } catch(err) {
                throw res
            }
        })
        .then((res) => {
            return res
        })
    }   

    static SaveTrip(trip: TripModal): Promise<any> {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/savetrip', 
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + AuthProvider.Token
            },
            body: JSON.stringify(trip)
        })
        .then((res) => {
            try {
                return res.json()
            } catch(err) {
                throw res
            }
        })
        .then((res) => {
            return res
        })
    }

    static GetTrip(tripId: string, profileId: string) {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/gettrip', {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + AuthProvider.Token
            },
            body: JSON.stringify({
                "tripId": tripId,
                "profileId": profileId
            })
        })
        .then((res) => {
            try {
                return res.json()
            } catch(err) {
                throw res
            }
        })
        .then((res) => {
            return res
        })
        .catch((err) => {
            console.log(err)
            throw err
        })
    }
    
    static GetTripCheckSumServer(trip: TripModal): Promise<any> {
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
            try {
                return res.json()
            } catch(err) {
                throw res
            }
        })
        .then((res) => {
            console.log(res)
            return res
        })
        .catch((err) => {
            console.log("Auth token " + AuthProvider.Token)
            console.log(err)
            throw err
        })
    }

    static UpdateTripBackground = async() => {
        var profilePageModal = Engine.Instance.Modal;
        var trips = profilePageModal.trips

        for(var trip of trips) {
            
        }

    }

    static getDateFromTimestamp(timestamp: number): string {
        var date = new Date(timestamp)
        return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
    }
}