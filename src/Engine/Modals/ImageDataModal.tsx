import { Region } from 'react-native-maps'

export class ImageDataModal {
    location: Region;
    image: string;
    timestamp: number;

    constructor(location: Region, image: string, timestamp: number) {
        this.location = location;
        this.image = image;
        this.timestamp = timestamp;
    }
}