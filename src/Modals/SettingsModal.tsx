export class SettingsModal {
    loggedIn: boolean
    loginProvider: string

    constructor() {
        this.loggedIn = false;
        this.loginProvider = "";
    }
}