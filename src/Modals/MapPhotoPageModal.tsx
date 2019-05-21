
import Region from './Region';
import ImageDataModal from './ImageDataModal';

export class MapPhotoPageModal {
    region: Region
    imageData: Array<ImageDataModal>
    sortedTimelineData: {[key: number]: Array<string>} 

    constructor(region: Region, imageData: Array<ImageDataModal>, sortedTimelineData: {[key: number]: Array<string>}) {
        this.region = region;
        this.imageData = imageData;
        this.sortedTimelineData = sortedTimelineData;
    }
}