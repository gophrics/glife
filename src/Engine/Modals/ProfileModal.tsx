import { NativeModules } from 'react-native';

export class ProfileModal {
    profileId: string = "";
    percentageWorldTravelled: number = 0;
    countriesVisited: Array<string> = [];
    coverPicURL: string = "";
    profilePicURL: string = "";
    name: string = "";
    password: string = "";
    email: string = "";
    

    CopyConstructor(modal: any) {
        this.profileId = modal.profileId;
        this.percentageWorldTravelled  = modal.percentageWorldTravelled;
        this.countriesVisited = modal.countriesVisited;
        this.coverPicURL = modal.coverPicURL;
        this.profilePicURL = modal.profilePicURL;
        this.name = modal.name;
        this.password = modal.password;
        this.email = modal.email;
    }

    get trips() {
        return NativeModules.ExposedAPI.getProfileData('trips', this.profileId)
    }
}