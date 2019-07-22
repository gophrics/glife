import { TripModal } from './TripModal';
import { NativeModules } from 'react-native';

export class ProfileModal {
    trips: TripModal[] = []
    countriesVisited: string[] = []
    percentageWorldTravelled: number = 0

    get coverPicURL() {
        return NativeModules.getProfileData('coverPicURL')
    }

    get profilePicURL() {
        return NativeModules.getProfileData('profilePicURL')
    }

    get profileId() {
        return NativeModules.getProfileData('profileId')
    }

    get name() {
        return NativeModules.getProfileData('name')
    }

    get password() {
        return NativeModules.getProfileData('password')
    }

    get email() {
        return NativeModules.getProfileData('email')
    }
}