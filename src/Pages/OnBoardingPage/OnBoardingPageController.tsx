import { HomeDataModal } from "../../Modals/ApplicationEnums";
import { TripUtils } from '../../Engine/Utils/TripUtils';
import * as Engine from '../../Engine/Engine';
import { PublisherSubscriber } from "../../Engine/PublisherSubscriber";

export class OnBoardingPageController {

    tempLocations: any[][];
    cursor: number;
    culprits: Array<number>;


    constructor() {
        this.tempLocations = [];
        this.cursor = 0;
        this.culprits = [];
        if(Engine.Instance.BlobProvider.homeData.length == 0) this.AddEmptyHome()
    }

    GetCachedDate = () => {
        return PublisherSubscriber.Bus['date'] || new Date()
    }

    SetCachedDate = (date: Date) => {
        PublisherSubscriber.Bus['date'] = date;
    }

    SaveData = () => {
        Engine.Instance.SaveEngineData()
    }
    
    AddEmptyHome = () => {
        Engine.Instance.BlobProvider.homeData.push({
          name: "",
          timestamp: 0
        } as HomeDataModal)
    }

    GetAllHomesData = () => {
        console.log("GetAllHomeData")
        console.log(Engine.Instance.BlobProvider.homeData)
        return Engine.Instance.BlobProvider.homeData;
    }

    GetHomeData = (index: number) => {
        return Engine.Instance.BlobProvider.homeData[index]
    }

    GetName = () : string => {
        return Engine.Instance.Modal.name
    }

    GetTempLocations = () => {
        return this.tempLocations;
    }

    SetAllHomeData = (homes: Array<HomeDataModal>) => {
        console.log("SaveAllHomeData")
        console.log(homes)
        Engine.Instance.BlobProvider.homeData = homes
        Engine.Instance.SaveEngineData()
    }

    SetHomeName = (index: number, name: string) => {
        Engine.Instance.BlobProvider.homeData[index].name = name
    }

    SetCursor = (index: number) => {
        this.cursor = index;
    }

    GetDateAsString = (timestamp: number) => {
        var dateObject = new Date(timestamp)
        return dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear()
    }

    onCalenderConfirm = (pos: number, dateObject: Date) => {
        Engine.Instance.BlobProvider.homeData[pos].timestamp = dateObject.getTime();
    }

    onLocationChangeText = (pos: number, text: string) => {
        Engine.Instance.BlobProvider.homeData[pos].name = text
    }

    onNewHomeClick = () => {
        this.AddEmptyHome()
        this.cursor = this.GetAllHomesData().length + 1;
        this.culprits.push(0)
    }

    onDeleteHome = (index: number) => {
        var homes = []
        for (var i = 0; i < Engine.Instance.BlobProvider.homeData.length; i++) {
            if (i != index) {

                if (i == index - 1) {
                    homes.push({
                        name: Engine.Instance.BlobProvider.homeData[i].name,
                        timestamp: Engine.Instance.BlobProvider.homeData[index].timestamp
                    })
                } else 
                    homes.push(Engine.Instance.BlobProvider.homeData[i])
            }
        }
        Engine.Instance.BlobProvider.homeData = homes
    }


    findExactName(obj: any, name: string) {
        for (var key of obj) {
            if ((key.name + ", " + key.country).trim() == name.trim()) {
                return true;
            }
        }

        return false;
    }

    removeDuplicates = (obj: any) => {
        var result: { name: string, country: string }[] = []
        for (var key of obj) {
            var t = key.display_name.split(', ')
            if (!this.findExactName(result, t[0] + ", " + t[t.length - 1]))
                result.push({
                    name: t[0],
                    country: t[t.length - 1]
                })
        }
        return result
    }

    validateAndGetCulprits = async() => {
        var count = 0;

        var culprits: Array<number> = []

        for (var i = 0; i < culprits.length; i++) culprits.push(1)

        this.tempLocations = []
        for (var home of Engine.Instance.BlobProvider.homeData) {
            if(home.name == "") {
                culprits[count] = 1;
                count++; continue;
            }
            var res = await TripUtils.getCoordinatesFromLocation(home.name)
            res = this.removeDuplicates(res)
            
            this.tempLocations.push([])
            
            for (var obj of res) {
                this.tempLocations[count].push(obj);
            }

            if (res && res.length == 1 || (this.findExactName(res, home.name))) { culprits[count] = 0 }
            else if (res) culprits[count] = 2
            count++
        }
        
        this.culprits = culprits;

        return culprits
    }
}