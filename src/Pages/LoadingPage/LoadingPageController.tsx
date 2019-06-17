import { LoadingPageModal } from "./LoadingPageModal";
import { ImageDataModal } from "../../Modals/ImageDataModal";
import { PermissionsAndroid, Platform } from 'react-native';
import * as PhotoLibraryProcessor from '../../Engine/PhotoLibraryProcessor'
import { TripUtils } from '../../Engine/TripUtils';
import { ProfilePageController } from "../ProfilePage/ProfilePageController";
import { TripExplorePageController } from "../TripExplorePage/TripExplorePageController";

export class LoadingPageController {

    Modal: LoadingPageModal;
    ProfilePageController: ProfilePageController;
    TripExplorePageController: TripExplorePageController;

    constructor() {
      this.Modal = new LoadingPageModal()
      this.TripExplorePageController = new TripExplorePageController()
      this.ProfilePageController = new ProfilePageController()
    }
    
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

        await TripUtils.GenerateHomeData(this.Modal.homeData)

        try {
            this.ProfilePageController.setTrips(await this.TripExplorePageController.GenerateTripFromPhotos(photoRollInfos))
        } catch (error) {
            return true;
        }
        return true
    }
}