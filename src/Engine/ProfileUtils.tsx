const ServerURLWithoutEndingSlash = 'http://beerwithai.com'


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
        .then((res: unknown) => {
            return (res as RandomUsernameModal).Username
        })
        .catch((err) => {
            return err
        })
    }

    static ValidateUsername = (username: string): Promise<boolean> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/username_exist/' + username, {
            method: 'GET'
        })
        .then((res: unknown) => {
            return (res as ValidateUsernameModal).Result
        })
        .catch((err) => {
            console.error(err)
            return false
        })
    }

    static SetUsername = (profileId: string, username: string) => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/profile/setusername', {
            method: 'POST',
            body: JSON.stringify({
                username: username
            })
        })
    }
}