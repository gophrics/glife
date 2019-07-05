
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
    
    get Token() : string{
        console.warn("Token " + AuthProvider._Token)
        return AuthProvider._Token
    }

    set Token(t: string){
        console.warn("Setting token " + t)
        AuthProvider._Token = t
    }

    static loginInfo: LoginUserModal = { Email: "", Password: ""}

    static RegisterUserWithGoogle = async(): Promise<any> => {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo)
        // If email entered is different from the google email, we use the google email for signup
        return AuthProvider._RegisterUserWithGoogle(userInfo.idToken)
    }

    static _RegisterUserWithGoogle = async(idToken: string|null): Promise<any> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/registerWithGoogle', {
            method: 'POST',
            body: JSON.stringify({
                token: idToken
            })
        })
        .then((res) => {return res.json()})
        .then((res: unknown) => {
            AuthProvider.Token = (res as LoginModal).Token
            return res
        })
        .catch((err) => {
            console.warn(err)
            throw err
        })
    }

    static RegisterUser = (data: RegisterUserModal) => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/register', {
            method: 'POST',
            body: JSON.stringify({
                phone: data.Phone,
                email: data.Email,
                password: data.Password
            })
        })        
        .then((res) => {return res.json()})
        .then((res: unknown) => {
            AuthProvider.Token = (res as LoginModal).Token
            return res
        })
        .catch((err) => {
            console.warn(err)
            throw err
        })
    }

    static LoginUser = (data: LoginUserModal) => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/login', {
            method: 'POST',
            body: JSON.stringify({
                email: data.Email,
                password: data.Password  
            })
        })        
        .then((res) => {return res.json()})
        .then((res: unknown) => {
            console.log(res)
            AuthProvider.Token = (res as LoginModal).Token
            return res
        })
        .catch((err) => {
            console.warn(err)
            throw err
        })
    }

    static LoginUserWithGoogle = (email: string, idToken: string|null) => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/loginWithGoogle', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                token: idToken
            })
        })
        .then((res) => {
            console.warn(res)
            try {
                return res.json()
            } catch(err) {
                throw res
            }
        })
        .then((res: unknown) => {
            console.log(res)
            AuthProvider.Token = (res as LoginModal).Token
            return res
        })
        .catch((err) => {
            console.warn(err)
            throw err
        })
    }
}