import { LoadingPageModal } from "./LoadingPageModal";
import { ProfilePageModal } from "../ProfilePage/ProfilePageModal";
import { ImageDataModal } from "../../Modals/ImageDataModal";
import { PermissionsAndroid, Platform } from 'react-native';
import * as PhotoLibraryProcessor from '../../Utilities/PhotoLibraryProcessor';
import { TripUtils } from '../../Utilities/TripUtils';

export class LoadingPageController {

    Modal: LoadingPageModal;
    ProfileData: ProfilePageModal = new ProfilePageModal();

    GetTotalToLoad = () => {
      return TripUtils.GetTotalToLoad()
    }

    GetFinishedLoading = () => {
      return TripUtils.GetFinishedLoading()
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
            console.warn(err)
            return false
          }
    }

    
    Initialize  = async() : Promise<boolean> => {

        if(Platform.OS == "android") await this.RequestPermissionAndroid()
        else if(Platform.OS == "ios") await PhotoLibraryProcessor.checkPhotoPermission()
        
        if(!(await PhotoLibraryProcessor.checkPhotoPermission())) {
            return false;
        }
        
        var photoRollInfos: ImageDataModal[] = await PhotoLibraryProcessor.getPhotosFromLibrary();

        // Create a No photos found warning page
        if(photoRollInfos.length == 0) {
            return true
        }

        await TripUtils.GenerateHomeData(this.Modal)

        try {
            this.ProfileData.trips = await TripUtils.GenerateTripFromPhotos(photoRollInfos)
        } catch (error) {
            return true;
        }
        return true
    }

    constructor() {
        this.Modal = new LoadingPageModal()
    }

}