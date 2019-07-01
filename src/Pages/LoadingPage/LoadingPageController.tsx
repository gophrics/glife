import { LoadingPageModal } from "./LoadingPageModal";
import { ImageDataModal } from "../../Engine/Modals/ImageDataModal";
import { PermissionsAndroid, Platform } from 'react-native';
import * as PhotoLibraryProcessor from '../../Engine/PhotoLibraryProcessor'
import { TripUtils } from '../../Engine/TripUtils';
import { ProfilePageController } from "../ProfilePage/ProfilePageController";
import { TripExplorePageController } from "../TripExplorePage/TripExplorePageController";
import { HomeDataModal } from "../../Modals/ApplicationEnums";
import * as PubSub from '../../Engine/PublisherSubscriber';

export class LoadingPageController {

    Modal: LoadingPageModal;
    ProfilePageController: ProfilePageController;
    TripExplorePageController: TripExplorePageController;

    constructor() {
      this.Modal = new LoadingPageModal()
      this.TripExplorePageController = new TripExplorePageController()
      this.ProfilePageController = new ProfilePageController()
    }
    
    GetTotalToLoad = (): number => {
      return TripUtils.GetTotalToLoad()
    }

    GetFinishedLoading = (): number => {
      return TripUtils.GetFinishedLoading()
    }

    GetAllHomesData = () : Array<HomeDataModal> => {
      return this.Modal.homeData;
    }

    SetAllHomeData = (homeData: Array<HomeDataModal>) => {
      this.Modal.homeData = homeData;
      this.Modal.Save()
    }

    GetHomeData = (index: number) => {
      return this.Modal.homeData[index]
    }

    SetHomeData = (index: number, home: HomeDataModal) => {
      this.Modal.homeData[index] = home;
      this.Modal.Save()
    }

    AddEmptyHome = () => {
      this.Modal.homeData.push({
        name: "",
        timestamp: 0
      } as HomeDataModal)
      this.Modal.Save()
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
        
        PubSub.Instance.PauseUpdate = true;
        var photoRollInfos: ImageDataModal[] = await PhotoLibraryProcessor.getPhotosFromLibrary();

        await TripUtils.GenerateHomeData(this.Modal.homeData)
        
        // Create a No photos found warning page
        if(photoRollInfos.length == 0) {
            return true
        }
        
        try {
            var trips = await this.TripExplorePageController.GenerateTripFromPhotos(photoRollInfos)
            this.ProfilePageController.ClearAndUpdateProfileDataWithAllTrips(trips)
        } catch (error) {
            console.warn(error)
            PubSub.Instance.PauseUpdate = false;
            return true;
        }
        PubSub.Instance.PauseUpdate = false;
        return true
    }
}