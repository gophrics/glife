import { HomeDataModal } from "../../Modals/ApplicationEnums";
import { LoadingPageController } from "../LoadingPage/LoadingPageController";
import { ProfilePageController } from "../ProfilePage/ProfilePageController";
import { TripUtils } from '../../Engine/TripUtils';

export class OnBoardingPageController {

    tempLocations: any[][];
    cursor: number;
    culprits: Array<number>;
    dates: Array<string>;
    LoadingPageController: LoadingPageController;
    ProfilePageController: ProfilePageController;


    constructor() {
        this.tempLocations = [];
        this.cursor = 0;
        this.culprits = [];
        this.dates = [];
        this.LoadingPageController = new LoadingPageController();
        this.ProfilePageController = new ProfilePageController();
    }

    GetAllHomesData = () => {
        return this.LoadingPageController.GetAllHomesData()
    }

    GetHomeData = (index: number) => {
        return this.LoadingPageController.GetHomeData(index)
    }

    GetAllDates = () => {
        return this.dates
    }

    GetName = () : string => {
        return this.ProfilePageController.getName();
    }

    GetTempLocations = () => {
        return this.tempLocations;
    }

    SetAllHomeData = (homes: Array<HomeDataModal>) => {
        this.LoadingPageController.SetAllHomeData(homes)    
    }

    SetHomeName = (index: number, name: string) => {
        var home = this.LoadingPageController.GetHomeData(index)
        home.name = name;
        this.LoadingPageController.SetHomeData(index, home)
    }

    SetCursor = (index: number) => {
        this.cursor = index;
    }

    GetDateAsString = (timestamp: number) => {
        var dateObject = new Date(timestamp)
        return dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear()
    }

    onCalenderConfirm = (dateObject: Date) => {
        if (this.LoadingPageController.GetAllHomesData().length <= this.cursor + 1) 
            this.LoadingPageController.AddEmptyHome()

        this.dates[this.cursor] = dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear()

        var home = this.LoadingPageController.GetHomeData(this.cursor)
        home.timestamp = dateObject.getTime();
        
        this.LoadingPageController.SetHomeData(this.cursor, home)
        this.culprits.push(0)
    }

    onLocationChangeText = (index: number, text: string) => {
        if (this.LoadingPageController.GetAllHomesData().length <= this.cursor)
            this.LoadingPageController.AddEmptyHome()
        
        var home = this.LoadingPageController.GetHomeData(index)
        home.name = text
        this.LoadingPageController.SetHomeData(index, home)
    }

    onDeleteHome = (index: number) => {
        var homes = []
        var dates = []
        for (var i = 0; i < this.LoadingPageController.GetAllHomesData().length; i++) {
            if (i != index) {
                if (i == index - 1) {
                    homes.push(
                    {   name: this.LoadingPageController.GetHomeData(i).name, 
                        timestamp: this.LoadingPageController.GetHomeData(i).timestamp == 0 ? NaN : this.LoadingPageController.GetHomeData(i).timestamp 
                    })
                    dates.push(this.dates[index])
                } else {
                    homes.push(this.LoadingPageController.GetHomeData(i))
                    dates.push(this.dates[i])
                }
            }
        }
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
        for (var home of this.LoadingPageController.GetAllHomesData()) {
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