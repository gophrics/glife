import * as React from 'react';
import { View, Button, Text } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { Page } from '../Modals/ApplicationEnums';
import { BlobSaveAndLoad } from '../Engine/BlobSaveAndLoad';
import { SettingsModal } from '../Engine/Modals/SettingsModal';
import { AuthProvider, RegisterUserModal } from '../Engine/AuthProvider';
import AsyncStorage from '@react-native-community/async-storage';

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
    if (this.myData == null) this.myData = new SettingsModal();
    this.state = {
      isSigninInProgress: false
    }
  }

  signUpUsingGoogle = async () => {
    try {
      this.setState({
        isSigninInProgress: true
      })
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.props.setPage(Page[Page.SETTING], this.myData)
      AuthProvider._RegisterUserWithGoogle(userInfo.idToken)
        .then((res) => {
          if (res) {
            this.myData.loginProvider = 'GOOGLE'
            this.myData.loggedIn = true
          }
          else {
            this.setState({
              isSigninInProgress: false
            })
          }
        })
    } catch (error) {
      this.setState({
        isSigninInProgress: false
      })

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

  onClearCache = () => {
    AsyncStorage.clear()
  }

  render() {
    return (
      <View>
        <Text style={{textAlign:'center', marginTop: 20, fontSize: 32, fontFamily:'AppleSDGothicNeo-Regular'}}> Lots of exciting features are in development, stay tuned! </Text>
        { /*
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.signUpUsingGoogle}
          disabled={false//this.state.isSigninInProgress || this.myData.loggedIn
          } />
        <Button title={"Clear Cache"} onPress={this.onClearCache} />
        */
        }
      </View>
    )
  }
}