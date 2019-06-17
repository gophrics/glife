import AsyncStorage from '@react-native-community/async-storage'

export class BlobSaveAndLoad {

    pageDataPipe: {[ key: string] : any} = {}
    homeData: any = {}
    endTimestamp: number = 0

    public static Instance = new BlobSaveAndLoad();
    
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
            endTimestamp: this.endTimestamp
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
                this.endTimestamp = EngineData.endTimestamp
            }
        })
    }

    getBlobValue = (page: string) => {
        return this.pageDataPipe[page] == undefined ? {} : this.pageDataPipe[page]
    }

    setBlobValue = (page: string, data: any) => {
        this.pageDataPipe[page] = data;
        this.saveBlob()
    }
}
