import Region from './Region';

export default class ImageDataModal {
    location: Region;
    image: any;
    timestamp: number;

    constructor(location: Region, image: any, timestamp: number) {
        this.location = location;
        this.image = image;
        this.timestamp = timestamp;
    }
}