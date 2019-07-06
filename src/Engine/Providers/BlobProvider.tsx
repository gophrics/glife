import AsyncStorage from '@react-native-community/async-storage'
import { ClusterModal } from '../Modals/ClusterModal';
import { TripUtils } from '../Utils/TripUtils';
import { AuthProvider } from './AuthProvider';
import { HomeDataModal } from '../../Modals/ApplicationEnums';
 
export class BlobProvider {

    private pageDataPipe: {[ key: string] : any} = {}
    homeData: Array<HomeDataModal> = []
    homesForDataClustering: {[key: number]: ClusterModal } = {}
    startTimestamp: number = 0
    endTimestamp: number = 0
    blobLoaded: boolean = false;
    engineBlobLoaded: boolean = false;

    email: string = "";
    password: string = "";

    constructor() {
        this.loadBlob()
        this.loadEngineData()
        console.log("BlobProvider constructor called")
    }

    saveBlob = () => {
        AsyncStorage.setItem('allData', JSON.stringify(this.pageDataPipe))
    }

    saveEngineData = () => {
        AsyncStorage.setItem('EngineData', JSON.stringify({
            homeData: this.homeData,
            homesForDataClustering: this.homesForDataClustering,
            startTimestamp: this.startTimestamp,
            endTimestamp: this.endTimestamp,
            loginInfo: AuthProvider.loginInfo,
            email: this.email,
            password: this.password
        }))
    }

    loadBlob = () => {
        return AsyncStorage.getItem('allData').then((data) => {
            this.blobLoaded = true;
            if(data != null) {
                this.pageDataPipe = JSON.parse(data)
                return this.pageDataPipe;
            } else {
                return null;
            }
        })
    }

    loadEngineData = () => {
        return AsyncStorage.getItem('EngineData').then((data) => {
            this.engineBlobLoaded = true;
            console.log(data)
            if(data != null) {
                var EngineData = JSON.parse(data)
                this.homeData = EngineData.homeData
                this.homesForDataClustering = EngineData.homesForDataClustering
                this.startTimestamp = EngineData.startTimestamp
                this.endTimestamp = EngineData.endTimestamp
                this.email = EngineData.email || ""
                this.password = EngineData.password || ""
                AuthProvider.loginInfo = EngineData.loginInfo
            }
            TripUtils.ExtendHomeDataToDate()
        })
    }

    getBlobValue = (page: string) => {
        return this.pageDataPipe[page]
    }

    setBlobValue = (page: string, data: any) => {
        this.pageDataPipe[page] = data;
        this.saveBlob()
    }
}
