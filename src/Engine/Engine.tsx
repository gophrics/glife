import { NativeModules } from 'react-native';
import { ProfileModal } from './Modals/ProfileModal';

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
    Modal: ProfileModal;

    constructor() {
        this.Modal = new ProfileModal()
    }
    
    setName = (name: string) => {

    }

    setEmailPassword = (email: string, password: string) => {

    }

    Initialize = async (): Promise<boolean> => {
        return await NativeModules.ExposedAPI.InitializeEngine();
    }
}

export var Instance = new Engine()