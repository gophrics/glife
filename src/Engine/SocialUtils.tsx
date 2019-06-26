import { AuthProvider } from "./AuthProvider";


const ServerURLWithoutEndingSlash = 'http://192.168.0.111:8083'

export class SocialUtils {
    static Search = (text: string): Promise<any> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/social/search/' + text, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + AuthProvider.Token
            }
        }).then((res) => {
            return res.json()
        })
    }

    static GetFeed = () : Promise<any> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/social/feeds', {
            method: 'GET',
            headers: {
                "Authorization": AuthProvider.Token
            }
        })
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            console.log(res)
            return res
        })
        .catch((err) => {
            console.warn(err)
            return err
        })
    }
}