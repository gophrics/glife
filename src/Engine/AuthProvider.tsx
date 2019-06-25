
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

const ServerURLWithoutEndingSlash = 'http://192.168.0.109'

interface LoginModal {
    Token: string
}

export class AuthProvider {

    static Token: string;

    static RegisterUserWithGoogle = async(): Promise<any> => {

        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
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
        .then((res: unknown) => {
            AuthProvider.Token = (res as LoginModal).Token
            return res
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
        .then((res: unknown) => {
            AuthProvider.Token = (res as LoginModal).Token
            return res
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
        .then((res: unknown) => {
            AuthProvider.Token = (res as LoginModal).Token
            return res
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
        .then((res: unknown) => {
            AuthProvider.Token = (res as LoginModal).Token
            return res
        })
    }
}