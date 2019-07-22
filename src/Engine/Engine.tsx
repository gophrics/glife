import { ProfileModal } from './Modals/ProfileModal';
import { BlobProvider } from './Providers/BlobProvider';
import { Page, HomeDataModal } from '../Modals/ApplicationEnums';
import { BackgroundSyncProvider } from './Providers/BackgroundSyncProvider';
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
    BlobProvider: BlobProvider;
    Modal: ProfileModal
    BackgroundProcess: BackgroundSyncProvider;
    AppState: AppState = {loggedIn: false, engineLoaded: EngineLoadStatus.None}

    constructor() {
        this.BlobProvider = new BlobProvider()
        this.Modal = new ProfileModal()
        this.BackgroundProcess = new BackgroundSyncProvider()
    }

    SaveEngineData = () => {
        this.BlobProvider.saveEngineData()
    }

    Save = () => {
        this.BlobProvider.setBlobValue(Page[Page.PROFILE], this.Modal)
    }

    setName = (name: string) => {
        this.Modal.name = name;
        this.BlobProvider.setBlobValue(Page[Page.PROFILE], this.Modal)
    }

    setEmailPassword = (email: string, password: string) => {
        this.BlobProvider.email = email;
        this.BlobProvider.password = password;
        this.SaveEngineData();
    }

    Initialize = async (): Promise<boolean> => {
        return await NativeModules.InitializeEngine();
    }
}

export var Instance = new Engine()