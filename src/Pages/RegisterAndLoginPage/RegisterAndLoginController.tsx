import * as Engine from '../../Engine/Engine';
import { NativeModules } from 'react-native';

export class RegisterAndLoginController {

    error: string

    constructor() {
        this.error = ""
    }

    GetCachedEmail = () => {
        return Engine.Instance.Modal.email
    }

    GetCachedPassword = () => {
        return Engine.Instance.Modal.password
    }

    GetRandomUsername = async(): Promise<string> => {
        var username = await NativeModules.GetRandomUsername()
        return username
    }

    ValidateUsername = async(username: string): Promise<boolean> => {
        return await NativeModules.ValidateUsername(username)
    }

    Login = async(email: string, password: string): Promise<boolean> => {
        try {
            var res = await NativeModules.LoginUser({
                Email: email,
                Password: password
            })
            if(res) {
                NativeModules.setProfileData('email', email); 
                NativeModules.setProfileData('password', password);
                Engine.Instance.AppState.loggedIn = true;
                return true
            } 
            return false
        } catch(err) {
            this.error = err.toString()
            return false
        }
    }

    Register = async(email: string, phone: string, password: string): Promise<boolean> => {
        try {
            var res = await NativeModules.RegisterUser({
                Email: email,
                Phone: phone,
                Password: password
            })
            if(res) {
                NativeModules.setProfileData('email', email); 
                NativeModules.setProfileData('password', password);
                Engine.Instance.AppState.loggedIn = true;
                return true
            } 
            return false
        } catch(err) {
            this.error = err.toString()
            return false
        }
    }

    LoginUsingGoogle = async(email: string, idToken: string) : Promise<boolean> => {
        try {
            var res = await NativeModules.LoginUserWithGoogle(email, idToken)
            if(res) {
                Engine.Instance.AppState.loggedIn = true;
                return true
            } 
            return false
        } catch(err) {
            this.error = err.toString();
            return false
        }
    }

    RegisterUsingGoogle = async () : Promise<boolean> => {
        try {
            var res = await NativeModules.RegisterUserWithGoogle()
            if(res) {
                Engine.Instance.AppState.loggedIn = true;
                return true
            } 
            return false
        } catch(err) {
            this.error = err;
            return false
        }
    }
}