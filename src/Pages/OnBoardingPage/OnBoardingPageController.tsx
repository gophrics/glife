import { HomeDataModal } from "../../Engine/Modals/HomeDataModal";
import * as Engine from '../../Engine/Engine';
import { NativeModules } from 'react-native';

export class OnBoardingPageController {

    tempLocations: Array<Array<string>>;
    cursor: number;
    culprits: Array<number>;
    homeData: Array<HomeDataModal> = [];
    homeDataLoaded: boolean = false;

    constructor() {
        this.tempLocations = [];
        this.cursor = 0;
        this.culprits = [];
        this.loadHomeData()
        console.log(NativeModules);
    }

    loadHomeData = async() => {
        var homes = await NativeModules.ExposedAPI.getHomeData()
        this.homeData = []
        for(var home of homes) {
            this.homeData.push({
                name: home.name,
                timestamp: home.timestamp,
                latitude: home.latitude,
                longitude: home.longitude
            } as HomeDataModal)
        }
        console.log(this.homeData)
        this.homeDataLoaded = true;
    }

    AddHomeWithLocation = async(location: string) => {
        await this.loadHomeData()
        if(this.homeData.length > 0)
            this.homeData[this.homeData.length - 1].timestamp = this.GetCachedDate().getTime()
        this.homeData.push({
            name: location,
            timestamp: 0,
            latitude: 0,
            longitude: 0
        } as HomeDataModal)
        return await this.SaveData()
    }

    GetCachedDateAsString = (date: Date) => {
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() 
    }

    GetCachedDate = () => {
        return Engine.Instance.Cache['date'] || new Date(0)
    }

    SetCachedDate = (date: Date) => {
        Engine.Instance.Cache['date'] = date;
    }

    SaveData = async() => {
        // Noone knows why this is required
        var homeData = []
        for(var home of this.homeData) {
            homeData.push({
                name: home.name,
                timestamp: home.timestamp,
                latitude: home.latitude,
                longitude: home.longitude
            } as HomeDataModal)
        }
        await NativeModules.ExposedAPI.setHomeData(homeData)
    }

    GetAllHomesData = () => {
        return this.homeData;
    }

    GetLastHomeData = () => {
        return this.homeData.length > 0 ? this.homeData[this.homeData.length-1] : undefined
    }

    GetName = async() : Promise<string> => {
        return await NativeModules.ExposedAPI.getProfileData('name', 'randomGeneratedId')
    }

    SetName = async(name: string) => {
        return await NativeModules.ExposedAPI.setProfileData({"name": name }, 'name', await Engine.Instance.Modal.profileId)
    }

    GetTempLocations = () => {
        return this.tempLocations;
    }

    SetCursor = (index: number) => {
        this.cursor = index;
    }

    onCalenderConfirm = async(pos: number, dateObject: Date) => {
        if(pos < this.homeData.length) {
            this.homeData[pos].timestamp = dateObject.getTime();
            this.SetCachedDate(dateObject);
            await this.SaveData()
        }
    }

    onLocationChangeText = async(pos: number, text: string) => {
        this.homeData[pos].name = text
        await this.SaveData()
    }

    onDeleteHome = async(index: number) => {
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
        await this.SaveData()
    }

    validateAndGetCulprits = async() => {
        var count = 0;
        this.culprits = []
        this.tempLocations = []

        for (var home of this.homeData) {
            if(home.name == "") {
                this.culprits.push(1)
                count++; 
                continue;
            }

            this.tempLocations.push(await this.validate(home.name))

            this.culprits.push(((await this.tempLocations[count].length) == 1) ? 0 : 1);
            count++;
        }

        return this.culprits
    }

    validate = async(location: string) => {
        var res = await NativeModules.ExposedAPI.getCoordinatesFromLocation(location)
        res = this.trimName(res)
        var tempLocations = []
        for (var obj of res) {
            tempLocations.push(obj);
        }
        return tempLocations
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
}