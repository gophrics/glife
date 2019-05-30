
import { months } from '../Modals/ApplicationEnums';
import { ClusterModal } from '../Modals/ClusterModal';
import { AsyncStorage } from 'react-native';

export class TravelUtils {

    static getLocationFromCoordinates(latitude: number, longitude: number): Promise<any> {
        return fetch('http://192.168.0.104:8080/api/v1/travel/searchcoordinates', {
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
        return fetch('http://192.168.0.104:8080/api/v1/travel/searchlocation', {
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
        return date.getDay() + " " + months[date.getMonth()] + " " + date.getFullYear()
    }

    static getTemperatureFromLocationAndTime(latitude: number, longitude: number, timestamp: number) : number {
        return 40;
    }
}