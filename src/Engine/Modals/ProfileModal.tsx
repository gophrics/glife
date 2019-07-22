import { NativeModules } from 'react-native';

export class ProfileModal {
    profileId: string = "";

    get percentageWorldTravelled() {
        return NativeModules.getProfileData('percentageWorldTravelled', this.profileId)
    }

    get countriesVisited() {
        return NativeModules.getProfileData('countriesVisited', this.profileId)
    }

    get trips() {
        return NativeModules.getProfileData('trips', this.profileId)
    }

    get coverPicURL() {
        return NativeModules.getProfileData('coverPicURL', this.profileId)
    }

    get profilePicURL() {
        return NativeModules.getProfileData('profilePicURL', this.profileId)
    }

    get name() {
        return NativeModules.getProfileData('name', this.profileId)
    }

    get password() {
        return NativeModules.getProfileData('password', this.profileId)
    }

    get email() {
        return NativeModules.getProfileData('email', this.profileId)
    }
}