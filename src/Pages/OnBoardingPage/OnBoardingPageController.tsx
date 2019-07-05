import { HomeDataModal } from "../../Modals/ApplicationEnums";
import { TripUtils } from '../../Engine/Utils/TripUtils';
import * as Engine from '../../Engine/Engine';

export class OnBoardingPageController {

    tempLocations: any[][];
    cursor: number;
    culprits: Array<number>;


    constructor() {
        this.tempLocations = [];
        this.cursor = 0;
        this.culprits = [];
    }


    AddEmptyHome = () => {
        Engine.Instance.homeData.push({
          name: "",
          timestamp: 0
        } as HomeDataModal)
    }

    GetAllHomesData = () => {
        return Engine.Instance.homeData;
    }

    GetHomeData = (index: number) => {
        return Engine.Instance.homeData[index]
    }

    GetName = () : string => {
        return Engine.Instance.Modal.name
    }

    GetTempLocations = () => {
        return this.tempLocations;
    }

    SetAllHomeData = (homes: Array<HomeDataModal>) => {
        Engine.Instance.homeData = homes
    }

    SetHomeName = (index: number, name: string) => {
        Engine.Instance.homeData[index].name = name
    }

    SetCursor = (index: number) => {
        this.cursor = index;
    }

    GetDateAsString = (timestamp: number) => {
        var dateObject = new Date(timestamp)
        return dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear()
    }

    onCalenderConfirm = (pos: number, dateObject: Date) => {
        Engine.Instance.homeData[pos].timestamp = dateObject.getTime();
    }

    onLocationChangeText = (pos: number, text: string) => {
        Engine.Instance.homeData[pos].name = text
    }

    onNewHomeClick = () => {
        this.AddEmptyHome()
        this.cursor = this.GetAllHomesData().length + 1;
        this.culprits.push(0)
    }

    onDeleteHome = (index: number) => {
        var homes = []
        for (var i = 0; i < Engine.Instance.homeData.length; i++) {
            if (i != index) {

                if (i == index - 1) {
                    homes.push({
                        name: Engine.Instance.homeData[i].name,
                        timestamp: Engine.Instance.homeData[index].timestamp
                    })
                } else 
                    homes.push(Engine.Instance.homeData[i])
            }
        }
        Engine.Instance.homeData = homes
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
        for (var home of Engine.Instance.homeData) {
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