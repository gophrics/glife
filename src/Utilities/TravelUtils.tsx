
import { months } from '../Modals/ApplicationEnums';

export class TravelUtils {

    static getLocationFromCoordinates(latitude: number, longitude: number): Promise<any> {
        return fetch('https://us1.locationiq.com/v1/reverse.php?key=daecd8873d0c8e&lat='+latitude+'&lon='+longitude+'&format=json', {
            method: 'GET'
        })
        .then((res) => {
            return res.json()
        }).then((res) => {
            console.log(res)
            return res;
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