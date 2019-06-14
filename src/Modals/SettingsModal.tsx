export class SettingsModal {
    loggedIn: boolean
    loginProvider: string
    photoPermission: boolean

    constructor() {
        this.loggedIn = false;
        this.loginProvider = "";
        this.photoPermission = true;
    }
}