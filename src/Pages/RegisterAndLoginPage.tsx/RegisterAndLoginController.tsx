import { AuthProvider, RegisterUserModal, LoginUserModal } from '../../Engine/AuthProvider'
import { ProfileUtils } from '../../Engine/ProfileUtils';

export class RegisterAndLoginController {

    constructor() {
        
    }

    GetRandomUsername = async(): Promise<string> => {
        var username = await ProfileUtils.GetRandomUsername()
        return username
    }

    ValidateUsername = async(username: string): Promise<boolean> => {
        return ProfileUtils.ValidateUsername(username)
    }

    Login = (email: string, password: string): Promise<boolean> => {
        return AuthProvider.LoginUser({
            Email: email,
            Password: password
        } as LoginUserModal)
        .then((res) => {
            if(res) return true
            return false
        })
    }

    Register = (email: string, phone: string, password: string): Promise<boolean> => {
        return AuthProvider.RegisterUser({
            Email: email,
            Phone: phone,
            Password: password
        } as RegisterUserModal)
        .then((res) => {
            if(res) {
                return true
            }
            return false
        })
    }

    LoginUsingGoogle = async(email: string, idToken: string) : Promise<boolean> => {
        var res = await AuthProvider.LoginUserWithGoogle(email, idToken)
        if(res) return true
        return false
    }

    RegisterUsingGoogle = async () : Promise<boolean> => {
        var res = await AuthProvider.RegisterUserWithGoogle()
        if(res) return true
        return false
    }
}