import { LoadingPageModal } from "./LoadingPageModal";
import { PermissionsAndroid, Platform } from 'react-native';
import * as PhotoLibraryProcessor from '../../Engine/Utils/PhotoLibraryProcessor'
import { TripUtils } from '../../Engine/Utils/TripUtils';
import { ProfilePageController } from "../ProfilePage/ProfilePageController";
import { TripExplorePageController } from "../TripExplorePage/TripExplorePageController";
import { HomeDataModal } from "../../Modals/ApplicationEnums";
import * as Engine from "../../Engine/Engine";

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

    Initialize = async() => {
      if(Platform.OS == "android") await this.RequestPermissionAndroid()
        else if(Platform.OS == "ios") await PhotoLibraryProcessor.checkPhotoPermission()
        
        if(!(await PhotoLibraryProcessor.checkPhotoPermission())) {
            return false;
        }
        
        return Engine.Instance.Initialize()
    }
}