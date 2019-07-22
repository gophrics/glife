import { PermissionsAndroid, Platform } from 'react-native';
import * as Engine from "../../Engine/Engine";

export class LoadingPageController { 

    constructor() {
      
    }

    AtleastOneTripExist = () => {
      console.log(Engine.Instance.Modal.trips)
      return Engine.Instance.Modal.trips.length > 0
    }
    
    RequestPermissionAndroid = async() : Promise<boolean> => {
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'Cool Photo App Camera Permission',
                message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use read from the storage")
                return true;
            } else {
              console.log("Storage permission denied")
              return false
            }
          } catch (err) {
            console.log(err)
            return false
          }
    }

    Initialize = async() => {
        return await Engine.Instance.Initialize()
    }
}