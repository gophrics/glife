
import { months } from '../Modals/ApplicationEnums';

export class TravelUtils {

    static getLocationFromCoordinates(latitude: number, longitude: number): Promise<any> {
        return fetch('https://geocode.xyz/' + latitude + "," + longitude + '?json=1&auth=535581842205350452289x2442', {
            method: 'GET'
        })
        .then((res) => {
            return res.json()
        }).then((res) => {
            return res.city
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