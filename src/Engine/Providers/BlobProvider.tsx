import AsyncStorage from '@react-native-community/async-storage'
import { ClusterModal } from '../Modals/ClusterModal';
import { TripUtils } from '../Utils/TripUtils';
import { AuthProvider } from './AuthProvider';
 
export class BlobProvider {

    private pageDataPipe: {[ key: string] : any} = {}
    homeData: {[key:number]: ClusterModal} = {}
    startTimestamp: number = 0
    endTimestamp: number = 0

    public static Instance = new BlobProvider();
    
    constructor() {
        this.loadBlob()
        this.loadEngineData()
    }

    saveBlob = () => {
        AsyncStorage.setItem('allData', JSON.stringify(this.pageDataPipe))
    }

    saveEngineData = () => {
        AsyncStorage.setItem('EngineData', JSON.stringify({
            homeData: this.homeData,
            startTimestamp: this.startTimestamp,
            endTimestamp: this.endTimestamp,
            loginInfo: AuthProvider.loginInfo
        }))
    }

    loadBlob = () => {
        return AsyncStorage.getItem('allData').then((data) => {
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
            if(data != null) {
                var EngineData = JSON.parse(data)
                this.homeData = EngineData.homeData
                this.startTimestamp = EngineData.startTimestamp
                this.endTimestamp = EngineData.endTimestamp
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
