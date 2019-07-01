import * as React from 'react';
import {
  View,
  SafeAreaView
} from 'react-native'
import {Page} from './Modals/ApplicationEnums';
import LoadingPageViewModal from './Pages/LoadingPage/LoadingPageViewModal';
import ProfilePage from './Pages/ProfilePage/ProfilePageViewModal';
import { TopNavigator } from './UIComponents/TopNavigator';
import { OnBoardingPageViewModal } from './Pages/OnBoardingPage/OnBoardingPageViewModal';
import TripExplorePageViewModal from './Pages/TripExplorePage/TripExplorePageViewModal';
import { SplashScreen } from './Pages/SplashScreen';
import { NewTripPage } from './Pages/NewTripPage/NewTripPageViewModal';
import { BlobProvider } from './Engine/Providers/BlobProvider';
import LinearGradient from 'react-native-linear-gradient';
import { SettingsPage } from './Pages/SettingsPage';
import { GoogleSignin } from 'react-native-google-signin';
import { RegisterUserPage } from './Pages/RegisterAndLoginPage/RegisterUserPage';
import { LoginUserPage } from './Pages/RegisterAndLoginPage/LoginUserPage';
import { PreOnBoardingPage } from './Pages/OnBoardingPage/PreOnBoardingPage';
import { BottomNavigator } from './UIComponents/BottomNavigator';
import { SearchPageViewModal } from './Pages/SearchPage/SearchPageViewModal';
import { NoPermissionIOS } from './Pages/NoPermissionIOS';
import { AskForLocationChangeDatePage } from './Pages/OnBoardingPage/AskForLocationChangeDatePage';
import { AskForLocationPage } from './Pages/OnBoardingPage/AskForLocationPage';
import { ConfirmUsernamePage } from './Pages/SocialPage/ConfirmUsernamePage';
import { RegisterAndLoginController } from './Pages/RegisterAndLoginPage/RegisterAndLoginController';
import { AuthProvider } from './Engine/Providers/AuthProvider';
import { TripUtils } from './Engine/Utils/TripUtils';
import * as Engine from './Engine/Engine';

interface IState {
  page: string,
  navigatorVisible: boolean
}

interface IProps {

}

export default class App extends React.Component<IProps, IState> {

  loggedIn: boolean;

  constructor(props: IProps) {
    super(props);
    this.state = {
      // Change to Page.NONE
      page: Page[Page.SPLASHSCREEN],
      navigatorVisible: true
    };
    // Uncomment for development
    // AsyncStorage.clear()
    
    BlobProvider.Instance.loadBlob()
    .then((res) => {
      this.setState({
        page: res == null || res[Page[Page.PROFILE]] == undefined || res[Page[Page.PROFILE]].countriesVisited == undefined ? Page[Page.PREONBOARDING] : Page[Page.PROFILE]
      })
    })

    this.loggedIn = false;

    GoogleSignin.configure({
      scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
      iosClientId: '249369235819-uc0l7d7imtlsebj80s93ucb1mvj6vo8v.apps.googleusercontent.com', // only for iOS
      webClientId: '249369235819-11cfia1ht584n1kmk6gh6kbba8ab429u.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
      accountName: '', // [Android] specifies an account name on the device that should be used
    })
    
    this.tryLogin()
    this.updateBackground()
  }

  updateBackground = () => {
    setTimeout(() => {
      console.log(this.loggedIn)
      if(this.loggedIn)
      TripUtils.UpdateTripBackground()
    }, 10000)
  }
  
  tryLogin = async() => {    
    var LoginController = new RegisterAndLoginController();
    var tryLoginUsingPassword = await LoginController.Login(AuthProvider.loginInfo.Email, AuthProvider.loginInfo.Password)
    if(!tryLoginUsingPassword) {
      var user = await GoogleSignin.signInSilently()
      var res = await LoginController.LoginUsingGoogle(user.user.email, user.idToken || "")
      this.loggedIn = true
      console.log("Logged in: " + res)
    } else {
      this.loggedIn = false;
    }
    setTimeout(() => {      
      if(!this.loggedIn)
        this.tryLogin()
    }, 10000)
  }

  setPage(page: string, data: any = null) {
    if(data != null) 
      Engine.Instance.PubSub.Bus[page] = data
    this.setState({
      page: page
    });
  }

  sliderChange(item: string) {
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
            this.state.page == Page[Page.ASKFORDATE] ? 
              <AskForLocationChangeDatePage setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.ASKFORLOCATION] ? 
              <AskForLocationPage setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.LOADING] ?
              <LoadingPageViewModal setNavigator={this.setNavigator} setPage={this.setPage.bind(this)} />
            : this.state.page == Page[Page.PROFILE] ? 
              <ProfilePage setNavigator={this.setNavigator} setPage={this.setPage.bind(this)} />
            : this.state.page == Page[Page.PREONBOARDING] ? 
              <PreOnBoardingPage navigatorVisible={this.state.navigatorVisible} setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.ONBOARDING] ? 
              <OnBoardingPageViewModal navigatorVisible={this.state.navigatorVisible} setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.TRIPEXPLORE] ?
              <TripExplorePageViewModal setPage={this.setPage.bind(this)} setNavigator={this.setNavigator}/>
            : this.state.page == Page[Page.SPLASHSCREEN] ? 
              <SplashScreen setNavigator={this.setNavigator} />
            : this.state.page == Page[Page.NEWTRIP] ? 
              <NewTripPage setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.SETTING] ? 
              <SettingsPage setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.REGISTER] ? 
              <RegisterUserPage setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.LOGIN] ? 
              <LoginUserPage setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.SEARCH] ?
              <SearchPageViewModal setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.NOPERMISSIONIOS] ? 
              <NoPermissionIOS setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.CONFIRMUSERNAME] ? 
              <ConfirmUsernamePage setPage={this.setPage.bind(this)}/>
            : <View />
          }
          
        </View>
        </SafeAreaView>
        {this.state.navigatorVisible ? 
          <View style={{position: 'absolute', bottom: 0, height: 60, backgroundColor: '#ffffffff'}}>
              <BottomNavigator visible={this.state.navigatorVisible} navigatorFunc={this.sliderChange.bind(this)}/> 
          </View>
        : <View />}
        </LinearGradient>
    )
  }
}