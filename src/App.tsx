import * as React from 'react';
import {
  View,
  SafeAreaView,
  DatePickerIOS,
} from 'react-native'
import {Page} from './Modals/ApplicationEnums';
import TripExplorePage from './Pages/TripExplorePage';
import LoadingPage from './Pages/LoadingPage';
import ProfilePage from './Pages/ProfilePage';
import { TopNavigator } from './UIComponents/TopNavigator';
import { OnBoardingPage } from './Pages/OnBoardingPage';
import StepExplorePage from './Pages/StepExplorePage';
import { SplashScreen } from './Pages/SplashScreen';
import { NewTripPage } from './Pages/NewTripPage';
import { BlobSaveAndLoad } from './Utilities/BlobSaveAndLoad';
import LinearGradient from 'react-native-linear-gradient';
import { SettingsPage } from './Pages/SettingsPage';
import { GoogleSignin } from 'react-native-google-signin';
import { AuthProvider } from './Utilities/AuthProvider';

interface IState {
  page: string,
  navigatorVisible: boolean
}

interface IProps {

}

export default class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      // Change to Page.NONE
      page: Page[Page.SPLASHSCREEN],
      navigatorVisible: true
    };
    // Uncomment for development
    //AsyncStorage.clear()
    
    BlobSaveAndLoad.Instance.loadBlob()
    .then((res) => {
      this.setState({
        page: res == null ? Page[Page.ONBOARDING] : Page[Page.PROFILE]
      })
      this.signInGoogleSilently()
    })

    GoogleSignin.configure({
      scopes: [''], // what API you want to access on behalf of the user, default is email and profile
      iosClientId: '249369235819-uc0l7d7imtlsebj80s93ucb1mvj6vo8v.apps.googleusercontent.com', // only for iOS
      webClientId: '249369235819-11cfia1ht584n1kmk6gh6kbba8ab429u.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
      accountName: '', // [Android] specifies an account name on the device that should be used
    })

  }

  signInGoogleSilently = async () => {
    try {
    const userInfo = await GoogleSignin.signIn();
    AuthProvider.LoginUser(userInfo.user.email, userInfo.idToken)
    .then((res) => {
      if(res) {
        var data = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.SETTING])
        data.loginProvider = 'GOOGLE'
        data.loggedIn = true
        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.SETTING], data)
      }
    })
    } catch(error) {
      // User not registered
    }
  }

  setPage(page: string, data: any) {
    if(data != null) 
      BlobSaveAndLoad.Instance.setBlobValue(page, data);
    BlobSaveAndLoad.Instance.saveBlob();
    // AsyncStorage.setItem('lastPage', page);
    // console.log()
    // AsyncStorage.setItem('lastPageDataPipe', JSON.stringify(this.state.pageDataPipe));
    this.setState({
      page: page
    });
  }

  sliderChange(item: string) {
    console.log("Slider changed!! " + item);
    this.setState({
      page: item
    })
  }

  setNavigator = (value: boolean) => {
    this.setState({
      navigatorVisible: value
    })
  }

  render() {
    return (
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']}>
        <SafeAreaView>
        <View style={{flexDirection: 'column', height: "100%"}}>
        {this.state.navigatorVisible ? 
          <View style={{height: 60, backgroundColor: '#00000000'}}>
              <TopNavigator visible={this.state.navigatorVisible} navigatorFunc={this.sliderChange.bind(this)}/> 
          </View>
        : <View />}
          {
            this.state.page == Page[Page.LOADING] ?
              <LoadingPage setNavigator={this.setNavigator} onDone={(data) => this.setPage(Page[Page.PROFILE], data)} />
            : this.state.page == Page[Page.PROFILE] ? 
              <ProfilePage setNavigator={this.setNavigator} setPage={this.setPage.bind(this)} />
            : this.state.page == Page[Page.TRIPEXPLORE] ? 
              <TripExplorePage setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.ONBOARDING] ? 
              <OnBoardingPage onDone={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.STEPEXPLORE] ?
              <StepExplorePage setPage={this.setPage.bind(this)} setNavigator={this.setNavigator}/>
            : this.state.page == Page[Page.SPLASHSCREEN] ? 
              <SplashScreen setNavigator={this.setNavigator} />
            : this.state.page == Page[Page.NEWTRIP] ? 
              <NewTripPage setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.SETTING] ? 
              <SettingsPage setPage={this.setPage.bind(this)}/>
            : <View />
          }
        </View>
        </SafeAreaView>
        </LinearGradient>
    )
  }
}