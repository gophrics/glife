
export class TravelUtils {

    static getLocationFromCoordinates(latitude: number, longitude: number): Promise<any> {
        return fetch('https://geocode.xyz/' + latitude + "," + longitude + '?json=1', {
            method: 'GET'
        })
        .then((res) => {
            console.log(res)
            return res.json()
        })
    }

    static getDateFromTimestamp(timestamp: number): string {
        var date = new Date(timestamp)
        return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear()
    }

    static getTemperatureFromLocationAndTime(latitude: number, longitude: number, timestamp: number) : number {
        return 0
    }
}