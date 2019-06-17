import { TripExplorePageModal } from '../TripExplorePage/TripExplorePageModal';
import { BlobSaveAndLoad } from '../../Engine/BlobSaveAndLoad';
import { Page } from '../../Modals/ApplicationEnums';

export class ProfilePageModal {

    trips: TripExplorePageModal[];
    countriesVisited: string[]
    percentageWorldTravelled: number
    coverPicURL: string

    // Profile stuff
    profilePicURL: string
    profileId: string
    name: string
    
    constructor() {
        this.trips = [];
        this.countriesVisited = []
        this.percentageWorldTravelled = 0
        this.coverPicURL = ""
        this.profilePicURL = ""
        this.profileId = ""
        this.name = ""

        var profileData: ProfilePageModal = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.PROFILE])
        
        if(profileData == undefined) return
        this.CopyConstructor(profileData)
    }

    CopyConstructor(profileData: ProfilePageModal) {
        this.trips = profileData.trips;
        this.countriesVisited = profileData.countriesVisited;
        this.percentageWorldTravelled = profileData.percentageWorldTravelled;
        this.coverPicURL = profileData.coverPicURL;
        this.profilePicURL = profileData.profilePicURL;
        this.profileId = profileData.profileId;
        this.name = profileData.name;
    }

    Save = () => {
        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.PROFILE], this)
    }
}