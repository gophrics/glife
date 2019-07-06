
import { months, Page, HomeDataModal } from '../../Modals/ApplicationEnums';
import { ClusterModal } from '../Modals/ClusterModal';
import { AuthProvider } from '../Providers/AuthProvider';
import * as Constants from "../Constants"
import { TripModal } from '../Modals/TripModal';
import * as Engine from '../Engine';

const ServerURLWithoutEndingSlash = Constants.ServerURL

export class TripUtils {
    static TOTAL_TO_LOAD = 100;
    static FINISHED_LOADING = 0;
    static LAST_TRIP_PRESS = 0;
    
    static GenerateTripId = () : string => {
        return Math.floor(Math.random()*10000000).toString()
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
                throw res.body
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
                throw res.body
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
                throw res.body
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
                throw res.body
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
                throw res.body
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
                throw res.body
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
                throw res.body
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