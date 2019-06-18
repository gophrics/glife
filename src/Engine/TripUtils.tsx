
import { months, Page, HomeDataModal } from '../Modals/ApplicationEnums';
import { ClusterModal } from '../Modals/ClusterModal';
import { BlobSaveAndLoad } from './BlobSaveAndLoad';

const ServerURLWithoutEndingSlash = 'http://beerwithai.com'



export class TripUtils {
    static TOTAL_TO_LOAD = 100;
    static FINISHED_LOADING = 0;
    static LAST_TRIP_PRESS = 0;
    
    static GenerateTripId = () : number => {
        return Math.random()*10000000
    }

    static GenerateHomeData = async(homeInfo: Array<HomeDataModal>) : Promise<void> => {

        var homes: Array<{latitude: number, longitude: number, timestamp: number}> = [];
        var homesDataForClustering: Array<unknown> = [];

        for(var element of homeInfo) {
            var res = await TripUtils.getCoordinatesFromLocation(element.name)
            res = res[0];
            homes.push({
                latitude: Number.parseFloat(res.lat),
                longitude: Number.parseFloat(res.lon),
                timestamp: (element.timestamp as number)
            })
        }

        var endTimestamp = Math.ceil((new Date()).getTime()/8.64e7);
        homes.sort((a, b) => {
            return b.timestamp - a.timestamp;
        })

        for(var data of homes) {
            while(endTimestamp >= Math.floor(data.timestamp/8.64e7) && endTimestamp >= 0) {
                homesDataForClustering[endTimestamp] = data as ClusterModal;
                endTimestamp--;
            }
        }

        BlobSaveAndLoad.Instance.homeData = homesDataForClustering;
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

    static getDateFromTimestamp(timestamp: number): string {
        var date = new Date(timestamp)
        return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
    }

}