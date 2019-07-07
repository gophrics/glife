
import { GoogleSignin } from 'react-native-google-signin';
import * as Constants from '../Constants';


export interface RegisterUserModal {
    Phone: string
    Email: string
    Password: string
}

export interface LoginUserModal {
    Email: string
    Password: string
}

const ServerURLWithoutEndingSlash = Constants.ServerURL + ":8080"

interface LoginModal {
    Token: string
}

export class AuthProvider {

    static _Token: string = "";
    
    static get Token() : string{
        return AuthProvider._Token
    }

    static set Token(t: string){
        AuthProvider._Token = t
    }

    static loginInfo: LoginUserModal = { Email: "", Password: ""}

    static RegisterUserWithGoogle = async(): Promise<boolean> => {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        // If email entered is different from the google email, we use the google email for signup
        return AuthProvider._RegisterUserWithGoogle(userInfo.idToken)
    }

    static _RegisterUserWithGoogle = async(idToken: string|null): Promise<boolean> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/registerWithGoogle', {
            method: 'POST',
            body: JSON.stringify({
                token: idToken
            })
        })
        .then((res) => {
            try {
                return res.json()
            } catch(err) {
                throw res.body
            }
        })
        .then((res: unknown) => {
            AuthProvider.Token = (res as LoginModal).Token
            return true
        })
        .catch((err) => {
            throw false
        })
    }

    static RegisterUser = (data: RegisterUserModal): Promise<boolean> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/register', {
            method: 'POST',
            body: JSON.stringify({
                phone: data.Phone,
                email: data.Email,
                password: data.Password
            })
        })        
        .then((res) => {
            try {
                return res.json()
            } catch(err) {
                throw res.body
            }
        })
        .then((res: unknown) => {
            AuthProvider.Token = (res as LoginModal).Token
            return true
        })
        .catch((err) => {
            return false
        })
    }

    static LoginUser = (data: LoginUserModal): Promise<boolean> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/login', {
            method: 'POST',
            body: JSON.stringify({
                email: data.Email,
                password: data.Password  
            })
        })        
        .then(async(res) => {
            try {
                return await res.json()
            } catch(err) {
                throw res.body
            }
        })        
        .then((res: unknown) => {
            AuthProvider.Token = (res as LoginModal).Token
            return true
        })
        .catch((err) => {
            return false
        })
    }

    static LoginUserWithGoogle = (email: string, idToken: string|null) : Promise<boolean> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/loginWithGoogle', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                token: idToken
            })
        })
        .then((res) => {
            try {
                return res.json()
            } catch(err) {
                throw res.body
            }
        })
        .then((res: unknown) => {
            AuthProvider.Token = (res as LoginModal).Token
            return true
        })
        .catch((err) => {
            return false
        })
    }
}