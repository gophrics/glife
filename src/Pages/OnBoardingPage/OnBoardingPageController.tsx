import { HomeDataModal } from "../../Engine/Modals/HomeDataModal";
import * as Engine from '../../Engine/Engine';
import { NativeModules } from 'react-native';

export class OnBoardingPageController {

    tempLocations: any[][];
    cursor: number;
    culprits: Array<number>;
    homeData: Array<HomeDataModal> = [];
    homeDataLoaded: boolean = false;

    constructor() {
        this.tempLocations = [];
        this.cursor = 0;
        this.culprits = [];
    }

    loadHomeData = async() => {
        this.homeData = await NativeModules.ExposedAPI.getHomeData()
        this.homeDataLoaded = true;
    }

    AddHomeWithLocation = async(location: string) => {
        this.homeData.push({
            name: location,
            timestamp: this.GetCachedDate().getTime(),
            latitude: 0,
            longitude: 0
        } as HomeDataModal)
    }

    GetCachedDateAsString = (date: Date) => {
        return date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() 
    }

    GetCachedDate = () => {
        return Engine.Instance.Cache['date'] || new Date()
    }

    SetCachedDate = (date: Date) => {
        Engine.Instance.Cache['date'] = date;
    }

    SetLastHomeLocation = (location: string) => {
        this.homeData[this.homeData.length - 1].name = location
        this.SaveData()
    }

    SetLastHomeTimestamp = (timestamp: number) => {
        this.homeData[this.homeData.length - 1].timestamp = timestamp
        this.SaveData()
    }

    SaveData = async() => {
        await NativeModules.ExposedAPI.setHomeData(this.homeData)
    }

    GetAllHomesData = () => {
        return this.homeData;
    }

    GetLastHomeData = async() => {
        if(this.homeData.length == 0) {
            await this.loadHomeData()
        }
        return this.homeData[this.homeData.length-1]
    }

    GetName = async() : Promise<string> => {
        return await NativeModules.ExposedAPI.getProfileData('name', 'randomGeneratedId')
    }

    GetTempLocations = () => {
        return this.tempLocations;
    }

    SetAllHomeData = async(homes: Array<HomeDataModal>) => {
        this.homeData = homes
        return await this.SaveData()
    }

    SetHomeName = (index: number, name: string) => {
        this.homeData[index].name = name
    }

    SetCursor = (index: number) => {
        this.cursor = index;
    }

    GetDateAsString = (timestamp: number) => {
        var dateObject = new Date(timestamp)
        return dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear()
    }

    onCalenderConfirm = async(pos: number, dateObject: Date) => {
        this.homeData[pos].timestamp = dateObject.getTime();
    }

    onLocationChangeText = (pos: number, text: string) => {
        this.homeData[pos].name = text
    }

    onDeleteHome = (index: number) => {
        var homes = []
        for (var i = 0; i < this.homeData.length; i++) {
            if (i != index) {

                if (i == index - 1) {
                    homes.push({
                        name: this.homeData[i].name,
                        timestamp: this.homeData[index].timestamp,
                        latitude: 0,
                        longitude: 0
                    } as HomeDataModal)
                } else 
                    homes.push(this.homeData[i])
            }
        }
        this.homeData = homes
    }

    trimName = (obj: any) : Array<string> => {
        var result: Array<string> = []
        var countries: Array<String> = []
        for (var key of obj) {
            var t = key.display_name.split(', ')
            if (countries.indexOf(t[t.length - 1]) == -1) {
                countries.push(t[t.length - 1])
                result.push(t[0] + ", " + t[t.length - 1])
            }
        }
        return result
    }

    validateAndGetCulprits = async() => {
        var count = 0;

        var culprits: Array<number> = []

        for (var i = 0; i < culprits.length; i++) culprits.push(1)

        this.tempLocations = []
        for (var home of this.homeData) {
            if(home.name == "") {
                culprits[count] = 1;
                count++; continue;
            }

            this.tempLocations[count] = await this.validate(home.name)

            culprits[count] = this.tempLocations.length == 1 ? 0 : 1;
            count++
        }
        
        this.culprits = culprits;

        return culprits
    }

    validate = async(location: string) => {
        var res = await NativeModules.ExposedAPI.getCoordinatesFromLocation(location)
        console.log(res)
        res = this.trimName(res)
        var tempLocations = []
        for (var obj of res) {
            tempLocations.push(obj);
        }
        return tempLocations
    }
}