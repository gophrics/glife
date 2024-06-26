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
import AsyncStorage from '@react-native-community/async-storage';

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
  }

  Initialize = async() => {
    console.log(NativeModules)
    AsyncStorage.getItem('profileId')
    .then((res) => {
      if(res) {
        NativeModules.ExposedAPI.getProfileData('name', res)
        .then((res2: string) => {
          if(res2 != "") {
            this.setState({
              page: Page[Page.PROFILE] // Change to profile
            })
          } else {
            this.setState({
              page: Page[Page.PREONBOARDING]
            })
          }
        })
      } else {  
        AsyncStorage.setItem('profileId', 'randomGeneratedId')
        this.setState({
          page: Page[Page.PREONBOARDING]
        })
      }
    })
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