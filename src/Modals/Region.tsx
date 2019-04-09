export default class Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;

    constructor(latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.latitudeDelta = latitudeDelta;
        this.longitudeDelta = longitudeDelta;
    }
}