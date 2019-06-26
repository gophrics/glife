import { AuthProvider } from "./AuthProvider";

const ServerURLWithoutEndingSlash = 'http://192.168.0.111:8080'


export interface ValidateUsernameModal {
    Result: boolean
}


interface RandomUsernameModal {
    Username: string
}

export class ProfileUtils {
    constructor() {

    }

    static GetRandomUsername = () : Promise<string> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/generate_username', {
            method: 'GET'
        })        
        .then((res) => { return res.json()} )
        .then((res: any) => {
            console.log(res)
            return (res as RandomUsernameModal).Username
        })
        .catch((err) => {
            console.error(err)
            throw err
        })
    }

    static ValidateUsername = (username: string): Promise<boolean> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/username_exist/' + username, {
            method: 'GET'
        })
        .then((res) => { return res.json()} )
        .then((res: any) => {
            return (res as ValidateUsernameModal).Result
        })
        .catch((err) => {
            console.error(err)
            throw err
        })
    }

    static SetUsername = (username: string) => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/setusername/' + username, {
            method: 'GET',
            headers: {
                "Authentication": AuthProvider.Token
            }
        })
        .then((res) => { return res.json()} )
        .then((res: any) => {
            return res
        })
        .catch((err) => {
            console.error(err)
            throw err
        })
    }
}