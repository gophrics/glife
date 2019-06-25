import { AuthProvider } from "./AuthProvider";


const ServerURLWithoutEndingSlash = 'http://192.168.0.109:8083'

export class SocialUtils {
    static Search = (text: string): Promise<any> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/search/' + text, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + AuthProvider.Token
            }
        }).then((res) => {
            return res
        })
    }
}