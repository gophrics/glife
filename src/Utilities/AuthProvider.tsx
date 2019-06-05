
import { GoogleSignin } from 'react-native-google-signin';


export interface RegisterUserModal {
    Name: string
    Phone: string
    Country: string
    Email: string
    Password: string
}

export interface LoginUserModal {
    Email: string
    Password: string
}

const ServerURLWithoutEndingSlash = 'http://beerwithai.com'

export class AuthProvider {

    static RegisterUserWithGoogle = async(data: RegisterUserModal): Promise<any> => {

        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        // If email entered is different from the google email, we use the google email for signup
        return AuthProvider._RegisterUserWithGoogle({
            Name: userInfo.user.name,
            Email: userInfo.user.email,
            Phone: data.Phone,
            Country: data.Country,
          } as RegisterUserModal, userInfo.idToken)
    }

    static _RegisterUserWithGoogle = async(data: RegisterUserModal, idToken: string|null): Promise<any> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/registerWithGoogle', {
            method: 'POST',
            body: JSON.stringify({
                name: data.Name,
                country: data.Country,
                phone: data.Phone,
                email: data.Email,
                token: idToken
            })
        })
    }

    static RegisterUser = (data: RegisterUserModal) => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/register', {
            method: 'POST',
            body: JSON.stringify({
                name: data.Name,
                country: data.Country,
                phone: data.Phone,
                email: data.Email
            })
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
    }

    static LoginUserWithGoogle = (email: string, idToken: string|null) => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/loginWithGoogle', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                token: idToken
            })
        })
    }
}