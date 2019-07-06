import { AuthProvider } from "../Providers/AuthProvider";

import * as Constants from "../Constants"

const ServerURLWithoutEndingSlash = Constants.ServerURL + ":8083"

export class SocialUtils {
    static Search = (text: string): Promise<any> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/social/search/' + text, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + AuthProvider.Token
            }
        }).then((res) => {
            try {
                return res.json()
            } catch(err) {
                throw res.body
            }
        })
    }

    static GetFeed = () : Promise<any> => {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/social/feeds', {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + AuthProvider.Token
            }
        })
        .then((res) => {
            try {
                return res.json()
            } catch(err) {
                throw res.body
            }
        })
        .then((res) => {
            console.log(res)
            return res
        })
        .catch((err) => {
            console.log(err)
            return err
        })
    }
}