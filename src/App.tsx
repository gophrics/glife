import * as React from 'react';
import {
  View,
  SafeAreaView,
  DatePickerIOS,
} from 'react-native'
// import RNBackgroundService from 'react-native-background-service';
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
import AsyncStorage from '@react-native-community/async-storage';

// RNBackgroundService.RNBackgroundServiceLocationListener.addListener('LocationListener',
// (res) => { console.log("Location: " + res) });


interface IState {
  page: string
}

interface IProps {

}

export default class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      // Change to Page.NONE
      page: Page[Page.SPLASHSCREEN],
    };
    // Uncomment for development
    AsyncStorage.clear()
    
    BlobSaveAndLoad.Instance.loadBlob()
    .then((res) => {
      this.setState({
        page: res == null ? Page[Page.ONBOARDING] : Page[Page.PROFILE]
      })
    })

  }

  setPage(page: string, data: any) {
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

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor:'#505050' }} >
        <View style={{flexDirection: 'column', height: "100%"}}>
          <View style={{height: 60}}>
            <TopNavigator navigatorFunc={this.sliderChange.bind(this)}/>
          </View>
          {
            this.state.page == Page[Page.LOADING] ?
              <LoadingPage onDone={(data) => this.setPage(Page[Page.PROFILE], data)} />
            : this.state.page == Page[Page.PROFILE] ? 
              <ProfilePage setPage={this.setPage.bind(this)} />
            : this.state.page == Page[Page.TRIPEXPLORE] ? 
              <TripExplorePage setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.ONBOARDING] ? 
              <OnBoardingPage onDone={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.STEPEXPLORE] ?
              <StepExplorePage/>
            : this.state.page == Page[Page.SPLASHSCREEN] ? 
              <SplashScreen />
            : this.state.page == Page[Page.NEWTRIP] ? 
              <NewTripPage setPage={this.setPage.bind(this)}/>
            : <View />
          }
        </View>
      </SafeAreaView>
    )
  }
}