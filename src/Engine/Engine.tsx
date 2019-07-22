import { NativeModules } from 'react-native';

export enum EngineLoadStatus {
    None = 0,
    Partial = 1,
    Full = 2
}

export interface AppState {
    loggedIn : boolean
    engineLoaded: EngineLoadStatus
}

export class Engine {
    AppState: AppState = {loggedIn: false, engineLoaded: EngineLoadStatus.None}

    Cache: any = {}
    constructor() {
    }

    SaveEngineData = () => {
    }

    Save = () => {
    }

    setName = (name: string) => {
    }

    setEmailPassword = (email: string, password: string) => {
        this.SaveEngineData();
    }

    Initialize = async (): Promise<boolean> => {
        return await NativeModules.InitializeEngine();
    }
}

export var Instance = new Engine()