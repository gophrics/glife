import { ProfileModal } from './Modals/ProfileModal';
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
    Modal: ProfileModal
    AppState: AppState = {loggedIn: false, engineLoaded: EngineLoadStatus.None}

    constructor() {
        this.Modal = new ProfileModal()
    }

    SaveEngineData = () => {
    }

    Save = () => {
    }

    setName = (name: string) => {
        this.Modal.name = name;
    }

    setEmailPassword = (email: string, password: string) => {
        this.SaveEngineData();
    }

    Initialize = async (): Promise<boolean> => {
        return await NativeModules.InitializeEngine();
    }
}

export var Instance = new Engine()