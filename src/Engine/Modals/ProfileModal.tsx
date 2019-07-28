import { NativeModules } from 'react-native';

export class ProfileModal {
    profileId: string = "";
    
    get percentageWorldTravelled() {
        return NativeModules.ExposedAPI.getProfileData('percentageWorldTravelled', this.profileId)
    }

    get countriesVisited() {
        return NativeModules.ExposedAPI.getProfileData('countriesVisited', this.profileId)
    }

    get trips() {
        return NativeModules.ExposedAPI.getProfileData('trips', this.profileId)
    }

    get coverPicURL() {
        return NativeModules.ExposedAPI.getProfileData('coverPicURL', this.profileId)
    }

    get profilePicURL() {
        return NativeModules.ExposedAPI.getProfileData('profilePicURL', this.profileId)
    }

    get name() {
        return NativeModules.ExposedAPI.getProfileData('name', this.profileId)
    }

    get password() {
        return NativeModules.ExposedAPI.getProfileData('password', this.profileId)
    }

    get email() {
        return NativeModules.ExposedAPI.getProfileData('email', this.profileId)
    }
}