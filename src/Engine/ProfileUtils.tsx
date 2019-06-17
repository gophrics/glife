const ServerURLWithoutEndingSlash = 'http://beerwithai.com'

export class ProfileUtils {
    constructor() {

    }

    static GenerateUsername = () : string => {
        return "thekingpong" + Math.random()*1000
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