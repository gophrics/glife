
import { GoogleSignin } from 'react-native-google-signin';


export interface RegisterUserModal {
    Phone: string
    Email: string
    Password: string
}

export interface LoginUserModal {
    Email: string
    Password: string
}

const ServerURLWithoutEndingSlash = 'http://192.168.0.109:8080'

interface LoginModal {
    Token: string
}

export class AuthProvider {

    static Token: string = "";
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
            console.error(err)
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
            console.error(err)
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
            AuthProvider.Token = (res as LoginModal).Token
            return res
        })
        .catch((err) => {
            console.error(err)
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
        .then((res) => {return res.json()})
        .then((res: unknown) => {
            AuthProvider.Token = (res as LoginModal).Token
            return res
        })
        .catch((err) => {
            console.error(err)
            throw err
        })
    }
}