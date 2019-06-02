import * as React from 'react';
import { View } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { Page } from '../Modals/ApplicationEnums';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import { SettingsModal } from '../Modals/SettingsModal';

interface IProps {
    setPage: any
}

interface IState {
    isSigninInProgress: boolean
}

export class SettingsPage extends React.Component<IProps, IState> {

    myData: SettingsModal;

    constructor(props: IProps) {
        super(props)
        this.myData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.SETTING])
        if(this.myData == null) this.myData = new SettingsModal();
        this.state = {
            isSigninInProgress: false
        }

        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
            iosClientId: '249369235819-uc0l7d7imtlsebj80s93ucb1mvj6vo8v.apps.googleusercontent.com', // only for iOS
            webClientId: '249369235819-11cfia1ht584n1kmk6gh6kbba8ab429u.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            hostedDomain: '', // specifies a hosted domain restriction
            forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
            accountName: '', // [Android] specifies an account name on the device that should be used
          })
    }

    _signIn = async ()  => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            this.myData.loginProvider = 'GOOGLE'
            this.myData.loggedIn = true
            this.props.setPage(Page[Page.SETTING], this.myData)
            console.log(userInfo)
          } catch (error) {
              console.log(error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
          }
    }

    render() {
        return (
            <View>
              <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this._signIn}
                disabled={this.state.isSigninInProgress} />
            </View>
        )
    }
}