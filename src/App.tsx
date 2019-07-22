import * as React from 'react';
import {
  View,
  SafeAreaView,
  NativeModules
} from 'react-native'
import {Page} from './Modals/ApplicationEnums';
import LoadingPageViewModal from './Pages/LoadingPage/LoadingPageViewModal';
import ProfilePage from './Pages/ProfilePage/ProfilePageViewModal';
import { TopNavigator } from './UIComponents/TopNavigator';
import { OnBoardingPageViewModal } from './Pages/OnBoardingPage/OnBoardingPageViewModal';
import TripExplorePageViewModal from './Pages/TripExplorePage/TripExplorePageViewModal';
import { SplashScreen } from './Pages/SplashScreen';
import { NewTripPage } from './Pages/NewTripPage/NewTripPageViewModal';
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
import * as Engine from './Engine/Engine';
import { NoPhotosFoundViewModal } from './Pages/LoadingPage/NoPhotosFoundViewModal';

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
    // AsyncStorage.clear()
    
    this.Initialize()

    GoogleSignin.configure({
      scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
      iosClientId: '249369235819-uc0l7d7imtlsebj80s93ucb1mvj6vo8v.apps.googleusercontent.com', // only for iOS
      webClientId: '249369235819-11cfia1ht584n1kmk6gh6kbba8ab429u.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
      accountName: '', // [Android] specifies an account name on the device that should be used
    })
    this.testfunc()
  }

  async testfunc() {
    console.log("Test is called")
    var res = await NativeModules.PhotoLibraryProcessor.getPhotosFromLibrary()
    console.log(res)
  }

  componentDidMount() {
  }

  Initialize = () => {
    if(Engine.Instance.AppState.engineLoaded == Engine.EngineLoadStatus.Full) {
      if (Engine.Instance.Modal.name != "") {
        this.setState({
          page: Page[Page.PROFILE]
        })
      } else {
        this.setState({
          page: Page[Page.PREONBOARDING]
        })
      }
    } else {
      setTimeout(this.Initialize, 1000)
    }
  }

  setPage(page: string, data: any = null) {
    if(data != null) 
      Engine.Instance.Cache[page] = data
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
            : this.state.page == Page[Page.NOPHOTOSFOUND] ? 
              <NoPhotosFoundViewModal setPage={this.setPage.bind(this)} />
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