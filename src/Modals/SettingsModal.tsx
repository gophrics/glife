export class SettingsModal {
    loggedIn: boolean
    loginProvider: string
    photoPermission: boolean
    profileId: string

    constructor() {
        this.loggedIn = false;
        this.loginProvider = "";
        this.photoPermission = true;
        this.profileId = "";
    }
}