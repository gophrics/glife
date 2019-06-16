import AsyncStorage from '@react-native-community/async-storage'

export class BlobSaveAndLoad {

    pageDataPipe: {[key:string]: any} = {}

    /*
        {
            'pageName: 'data..',
            ...
        }
    */


    public static Instance = new BlobSaveAndLoad();
    
    constructor() {

    }

    saveBlob = () => {
        AsyncStorage.setItem('allData', JSON.stringify(this.pageDataPipe))
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

    getBlobValue = (page: string) => {
        return this.pageDataPipe[page] == undefined ? {} : this.pageDataPipe[page]
    }

    setBlobValue = (page: string, data: any) => {
        this.pageDataPipe[page] = data;
        this.saveBlob()
    }
}
