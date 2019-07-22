import { PermissionsAndroid, Platform } from 'react-native';
import * as PhotoLibraryProcessor from '../../Engine/Utils/PhotoLibraryProcessor'
import { TripUtils } from '../../Engine/Utils/TripUtils';
import * as Engine from "../../Engine/Engine";

export class LoadingPageController { 

    constructor() {
      
    }
    
    GetTotalToLoad = (): number => {
      return TripUtils.GetTotalToLoad()
    }

    GetFinishedLoading = (): number => {
      return TripUtils.GetFinishedLoading()
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
      if(Platform.OS == "android") await this.RequestPermissionAndroid()
        else if(Platform.OS == "ios") await PhotoLibraryProcessor.checkPhotoPermission()
        
        if(!(await PhotoLibraryProcessor.checkPhotoPermission())) {
            return false;
        }
        
        return Engine.Instance.Initialize()
    }
}