
export interface RegisterUserModal {
    Name: string
    Phone: string
    Country: string
    Email: string
}

export class AuthProvider {

    static RegisterUserWithGoogle = (data: RegisterUserModal, idToken: string|null): Promise<any> => {
        return fetch('http://192.168.0.104:8080/api/v1/profile/registerWithGoogle', {
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

    static LoginUser = (email: string, idToken: string|null) => {
        return fetch('http://192.168.0.104:8080/api/v1/profile/loginWithGoogle', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                token: idToken
            })
        })
    }
}