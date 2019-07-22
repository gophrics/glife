import { NativeModules } from 'react-native';

export class NewTripPageController {


    tripName: string = "";

    constructor() {
    }

    setTripTitle = (title: string) => {
        this.tripName = title
    }

    validateInputs = () : boolean => {
        return this.tripName != "";
    }

    processNewTrip = () : boolean => {

        if(!this.validateInputs()) return false

        NativeModules.addNewTrip(this.tripName)
        
        return true
    }

}