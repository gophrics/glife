import * as React from 'react';
import { View, Button, Text, NativeModules } from 'react-native';
import { Page } from '../Modals/ApplicationEnums';
import { SettingsModal } from '../Engine/Modals/SettingsModal';
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
    this.myData = {} as SettingsModal
    if (this.myData == null) this.myData = new SettingsModal();
    this.state = {
      isSigninInProgress: false
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